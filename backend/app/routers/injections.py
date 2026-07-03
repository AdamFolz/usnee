from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, update, case
from typing import Optional
from datetime import datetime, timedelta
import logging

from app.database import get_db
from app.core.security import get_current_user_id
from app.schemas.schemas import InjectionCreate, InjectionResponse, StatsResponse, HistoryResponse, InjectionOut, UserOut, CancelRequest
from app.models.models import User, Injection, Batch
from app.services import achievements as ach_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["injections"])


async def get_or_create_user(db: AsyncSession, telegram_id: int) -> User:
    from sqlalchemy.dialects.postgresql import insert as pg_insert
    stmt = (
        pg_insert(User)
        .values(telegram_id=telegram_id)
        .on_conflict_do_nothing(index_elements=["telegram_id"])
        .returning(User)
    )
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if user is None:
        result = await db.execute(select(User).where(User.telegram_id == telegram_id))
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(500, "Race condition in user creation")
    return user


@router.post("/inject", response_model=InjectionResponse)
async def create_injection(
    data: InjectionCreate = Body(...),
    db: AsyncSession = Depends(get_db),
    telegram_id: int = Depends(get_current_user_id),
):
    """Создание записи об инъекции — без ограничений, только поддержка"""
    try:
        user = await get_or_create_user(db, telegram_id)
        
        # Optimistic locking для батча (atomic UPDATE)
        if data.batch_id is not None:
            result = await db.execute(
                update(Batch)
                .where(
                    and_(
                        Batch.id == data.batch_id,
                        Batch.user_id == user.id,
                        Batch.is_finished == False,
                        Batch.remaining_amount >= data.volume_ml,
                    )
                )
                .values(
                    remaining_amount=Batch.remaining_amount - data.volume_ml,
                    is_finished=(Batch.remaining_amount - data.volume_ml) <= 0,
                    finished_at=case(
                        (Batch.remaining_amount - data.volume_ml <= 0, func.now()),
                        else_=Batch.finished_at,
                    ),
                )
                .returning(Batch.id)
            )
            if not result.scalar_one_or_none():
                batch = await db.get(Batch, data.batch_id)
                if not batch:
                    raise HTTPException(404, "Batch not found")
                if batch.user_id != user.id:
                    raise HTTPException(403, "Access denied")
                if batch.is_finished:
                    raise HTTPException(400, "Batch already finished")
                if batch.remaining_amount < data.volume_ml:
                    raise HTTPException(400, f"Insufficient amount: {batch.remaining_amount}ml")
        
        # Создаём инъекцию
        injection = Injection(
            user_id=user.id,
            batch_id=data.batch_id,
            method=data.method,
            site=data.site,
            volume_ml=data.volume_ml,
            trigger=data.trigger,
            trigger_note=data.trigger_note,
        )
        db.add(injection)
        await db.flush()
        
        # Проверяем ачивки (event-driven, с учётом текущей инъекции)
        new_achievements = await ach_service.check_all(db, user.id, injection.injected_at)
        
        # Начисляем базовые XP (10 за инъекцию)
        await db.execute(
            update(User).where(User.id == user.id).values(xp=User.xp + 10)
        )
        
        await db.commit()
        
        return {
            "success": True,
            "injection_id": injection.id,
            "new_achievements": new_achievements,
            "message": "Записано ✓",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Database error: {e}")
        await db.rollback()
        raise HTTPException(503, "Database unavailable")


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    telegram_id: int = Depends(get_current_user_id),
):
    """Статистика без осуждения, только факты"""
    user = await get_or_create_user(db, telegram_id)
    
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    daily_count = await db.scalar(
        select(func.count(Injection.id))
        .where(
            and_(
                Injection.user_id == user.id,
                Injection.injected_at >= today,
                Injection.is_cancelled == False,
            )
        )
    )
    
    # Средний интервал за последние 7 дней
    week_ago = datetime.utcnow() - timedelta(days=7)
    result = await db.execute(
        select(Injection.injected_at)
        .where(
            and_(
                Injection.user_id == user.id,
                Injection.injected_at > week_ago,
                Injection.is_cancelled == False,
            )
        )
        .order_by(Injection.injected_at)
    )
    times = [row[0] for row in result.all()]
    avg_interval = None
    if len(times) > 1:
        intervals = [(times[i] - times[i-1]).total_seconds() / 3600 for i in range(1, len(times))]
        avg_interval = sum(intervals) / len(intervals)
    
    # Время последней инъекции
    last_injection = await db.scalar(
        select(Injection.injected_at)
        .where(
            and_(
                Injection.user_id == user.id,
                Injection.is_cancelled == False,
            )
        )
        .order_by(Injection.injected_at.desc())
    )
    
    last_ago = None
    if last_injection:
        delta = datetime.utcnow() - last_injection
        hours = int(delta.total_seconds() // 3600)
        minutes = int((delta.total_seconds() % 3600) // 60)
        if hours > 0:
            last_ago = f"{hours}ч {minutes}мин"
        else:
            last_ago = f"{minutes}мин"
    
    # Топ триггер
    top_trigger = await db.scalar(
        select(Injection.trigger)
        .where(
            and_(
                Injection.user_id == user.id,
                Injection.injected_at > week_ago,
                Injection.is_cancelled == False,
                Injection.trigger.isnot(None),
            )
        )
        .group_by(Injection.trigger)
        .order_by(func.count(Injection.trigger).desc())
    )
    
    return {
        "daily_count": daily_count or 0,
        "avg_interval": avg_interval,
        "last_injection_ago": last_ago,
        "top_trigger": top_trigger,
        "total_xp": user.xp,
        "level": user.level,
    }


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    cursor: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    telegram_id: int = Depends(get_current_user_id),
):
    """Cursor-based пагинация без COUNT — оптимизировано"""
    user = await get_or_create_user(db, telegram_id)
    
    query = (
        select(Injection)
        .where(
            and_(
                Injection.user_id == user.id,
                Injection.is_cancelled == False,
            )
        )
        .order_by(Injection.injected_at.desc())
        .limit(limit + 1)
    )
    
    if cursor:
        cursor_time = datetime.fromisoformat(cursor)
        query = query.where(Injection.injected_at < cursor_time)
    
    result = await db.execute(query)
    injections = result.scalars().all()
    
    has_more = len(injections) > limit
    if has_more:
        injections = injections[:limit]
    
    next_cursor = None
    if injections:
        next_cursor = injections[-1].injected_at.isoformat()
    
    return {
        "items": [InjectionOut.model_validate(inj) for inj in injections],
        "next_cursor": next_cursor,
        "has_more": has_more,
    }


@router.post("/injections/{id}/cancel")
async def cancel_injection(
    id: int,
    data: CancelRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    telegram_id: int = Depends(get_current_user_id),
):
    """Отмена записи об инъекции — с восстановлением батча"""
    try:
        user = await get_or_create_user(db, telegram_id)
        
        # Atomic optimistic locking
        result = await db.execute(
            update(Injection)
            .where(
                and_(
                    Injection.id == id,
                    Injection.user_id == user.id,
                    Injection.is_cancelled == False,
                )
            )
            .values(
                is_cancelled=True,
                cancelled_at=datetime.utcnow(),
                cancel_reason=data.reason,
            )
            .returning(Injection.batch_id, Injection.volume_ml)
        )
        
        updated = result.one_or_none()
        
        if not updated:
            raise HTTPException(404, "Injection not found or already cancelled")
        
        # Восстанавливаем батч
        if updated.batch_id:
            await db.execute(
                update(Batch)
                .where(Batch.id == updated.batch_id)
                .values(
                    is_finished=False,
                    finished_at=None,
                    remaining_amount=Batch.remaining_amount + updated.volume_ml,
                )
            )
        
        await db.commit()
        
        return {"success": True, "message": "Запись отменена"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Database error: {e}")
        await db.rollback()
        raise HTTPException(503, "Database unavailable")


@router.get("/me", response_model=UserOut)
async def get_me(
    db: AsyncSession = Depends(get_db),
    telegram_id: int = Depends(get_current_user_id),
):
    """Получить текущего пользователя"""
    user = await get_or_create_user(db, telegram_id)
    recent_achs = await ach_service.get_user_achievements(db, user.id)
    return {
        "telegram_id": user.telegram_id,
        "username": user.username,
        "first_name": user.first_name,
        "xp": user.xp,
        "level": user.level,
        "recent_achievements": recent_achs[:5],
    }
