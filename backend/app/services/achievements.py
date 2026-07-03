from datetime import datetime, timedelta
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, update, insert
from app.models.models import Achievement, UserAchievement, Injection, User

IRLACHIEVEMENTS = [
    {
        "code": "still_alive",
        "title": "Ого, ты всё ещё живой",
        "description": "5 инъекций за день. Респект организму.",
        "icon": "🧟",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "work_tomorrow",
        "title": "Надеюсь, завтра не на работу",
        "description": "3 инъекции после полуночи. Босс будет рад.",
        "icon": "💼",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "barely_breathing",
        "title": "Еле-еле, но иду",
        "description": "Интервал меньше часа. Ты точно в порядке?",
        "icon": "🫠",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "to_infinity",
        "title": "Бесконечность не предел",
        "description": "10 инъекций за сутки. Buzz Lightyear гордился бы.",
        "icon": "🚀",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "vampire",
        "title": "Ночная смена",
        "description": "Все инъекции с 00:00 до 06:00. Сон для слабых.",
        "icon": "🧛",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "speedrun",
        "title": "Спидраннер",
        "description": "3 инъекции за час. Any% категория?",
        "icon": "⚡",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "marathon",
        "title": "Марафонец",
        "description": "24 часа с инъекциями каждый час. Выносливость.",
        "icon": "🏃",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "collector",
        "title": "Коллекционер",
        "description": "5 разных мест за день. Всё тело в деле.",
        "icon": "🗺️",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "pharmacist",
        "title": "Аптечка-тоска",
        "description": "Закончили партию за 1 день. Скорость света.",
        "icon": "💊",
        "category": "ironic",
        "xp_reward": 0,
    },
    {
        "code": "architect",
        "title": "Архитектор",
        "description": "Первый раз запланировали партию заранее. Мыслитель.",
        "icon": "📐",
        "category": "positive",
        "xp_reward": 50,
    },
    {
        "code": "diary",
        "title": "Писатель",
        "description": "Записали 3 заметки о триггерах. Самоанализ — это круто.",
        "icon": "📝",
        "category": "positive",
        "xp_reward": 50,
    },
]


async def init_achievements(db: AsyncSession) -> None:
    """Инициализация ачивок в БД (idempotent)"""
    for ach in IRLACHIEVEMENTS:
        existing = await db.execute(
            select(Achievement).where(Achievement.code == ach["code"])
        )
        if not existing.scalar_one_or_none():
            db.add(Achievement(**ach))
    await db.commit()


async def check_all(db: AsyncSession, user_id: int, current_time: datetime) -> List[Dict[str, Any]]:
    """Проверка ачивок с учётом текущей инъекции — event-driven, не ретроспективно"""
    # Загружаем уже полученные ачивки пользователя
    result = await db.execute(
        select(UserAchievement)
        .join(Achievement)
        .where(UserAchievement.user_id == user_id)
    )
    existing_codes = {row.achievement.code for row in result.all()}
    
    stats = await _get_user_stats(db, user_id, current_time)
    new_achievements = []
    
    for ach in IRLACHIEVEMENTS:
        if ach["code"] in existing_codes:
            continue
        should_grant = await _evaluate_condition(db, user_id, ach["code"], stats, current_time)
        if should_grant:
            await _grant_achievement(db, user_id, ach)
            new_achievements.append(ach)
    
    if new_achievements:
        await db.commit()
    
    return new_achievements


async def _get_user_stats(db: AsyncSession, user_id: int, now: datetime) -> Dict[str, Any]:
    """Сбор статистики для проверки ачивок"""
    day_ago = now - timedelta(days=1)
    hour_ago = now - timedelta(hours=1)
    
    daily_count = await db.scalar(
        select(func.count(Injection.id))
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.injected_at > day_ago,
                Injection.is_cancelled == False,
            )
        )
    )
    
    night_count = await db.scalar(
        select(func.count(Injection.id))
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.injected_at > day_ago,
                Injection.is_cancelled == False,
                func.extract("hour", Injection.injected_at).between(0, 6),
            )
        )
    )
    
    min_interval = await db.scalar(
        select(func.min(
            func.extract("epoch", Injection.injected_at) - 
            func.lag(func.extract("epoch", Injection.injected_at)).over(
                order_by=Injection.injected_at
            )
        ))
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.injected_at > day_ago,
                Injection.is_cancelled == False,
            )
        )
    )
    
    return {
        "daily_count": daily_count or 0,
        "night_count": night_count or 0,
        "min_interval": (min_interval or 9999) / 3600,
    }


async def _evaluate_condition(
    db: AsyncSession, user_id: int, code: str, stats: Dict[str, Any], current_time: datetime
) -> bool:
    """Проверка конкретного условия ачивки — event-driven"""
    if code == "still_alive":
        return stats["daily_count"] >= 5
    elif code == "work_tomorrow":
        return stats["night_count"] >= 3
    elif code == "barely_breathing":
        return stats["min_interval"] < 1.0
    elif code == "to_infinity":
        return stats["daily_count"] >= 10
    elif code == "vampire":
        return await _check_vampire(db, user_id, current_time)
    elif code == "speedrun":
        return await _check_speedrun(db, user_id, current_time)
    elif code == "marathon":
        return await _check_marathon(db, user_id, current_time)
    elif code == "collector":
        return await _check_collector(db, user_id, current_time)
    elif code == "pharmacist":
        return await _check_pharmacist(db, user_id, current_time)
    elif code == "architect":
        return await _check_architect(db, user_id)
    elif code == "diary":
        return await _check_diary(db, user_id)
    return False


async def _check_vampire(db: AsyncSession, user_id: int, now: datetime) -> bool:
    day_ago = now - timedelta(days=1)
    total = await db.scalar(
        select(func.count(Injection.id))
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.injected_at > day_ago,
                Injection.is_cancelled == False,
            )
        )
    )
    if not total:
        return False
    day_count = await db.scalar(
        select(func.count(Injection.id))
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.injected_at > day_ago,
                Injection.is_cancelled == False,
                func.extract("hour", Injection.injected_at).between(6, 23),
            )
        )
    )
    return day_count == 0


async def _check_speedrun(db: AsyncSession, user_id: int, current_time: datetime) -> bool:
    """3 инъекции в течение 1 часа (включая текущую) — event-driven"""
    result = await db.execute(
        select(Injection.injected_at)
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.is_cancelled == False,
                Injection.injected_at <= current_time,
                Injection.injected_at > current_time - timedelta(hours=1),
            )
        )
        .order_by(Injection.injected_at)
    )
    times = [row[0] for row in result.all()]
    return len(times) >= 3


async def _check_marathon(db: AsyncSession, user_id: int, current_time: datetime) -> bool:
    """24 часа с инъекциями каждый час — UTC-based epoch buckets"""
    day_ago = current_time - timedelta(hours=24)
    result = await db.execute(
        select(Injection.injected_at)
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.is_cancelled == False,
                Injection.injected_at > day_ago,
                Injection.injected_at <= current_time,
            )
        )
        .order_by(Injection.injected_at)
    )
    times = [row[0] for row in result.all()]
    if len(times) < 24:
        return False
    
    hours = set()
    for t in times:
        slot = t.replace(minute=0, second=0, microsecond=0)
        hours.add(slot)
    
    return len(hours) >= 24


async def _check_collector(db: AsyncSession, user_id: int, now: datetime) -> bool:
    day_ago = now - timedelta(days=1)
    result = await db.execute(
        select(func.distinct(Injection.site))
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.injected_at > day_ago,
                Injection.is_cancelled == False,
            )
        )
    )
    sites = [row[0] for row in result.all()]
    return len(sites) >= 5


async def _check_pharmacist(db: AsyncSession, user_id: int, now: datetime) -> bool:
    from app.models.models import Batch
    day_ago = now - timedelta(days=1)
    result = await db.execute(
        select(Batch)
        .where(
            and_(
                Batch.user_id == user_id,
                Batch.created_at > day_ago,
                Batch.is_finished == True,
            )
        )
    )
    return result.scalar_one_or_none() is not None


async def _check_architect(db: AsyncSession, user_id: int) -> bool:
    from app.models.models import Batch
    result = await db.execute(
        select(Batch)
        .where(
            and_(
                Batch.user_id == user_id,
                Batch.drug_name.isnot(None),
            )
        )
    )
    return result.scalar_one_or_none() is not None


async def _check_diary(db: AsyncSession, user_id: int) -> bool:
    count = await db.scalar(
        select(func.count(Injection.id))
        .where(
            and_(
                Injection.user_id == user_id,
                Injection.trigger_note.isnot(None),
                Injection.is_cancelled == False,
            )
        )
    )
    return (count or 0) >= 3


async def _grant_achievement(db: AsyncSession, user_id: int, ach_data: Dict[str, Any]) -> None:
    """Выдача ачивки и начисление XP в рамках текущей транзакции"""
    achievement = await db.scalar(
        select(Achievement).where(Achievement.code == ach_data["code"])
    )
    if not achievement:
        return
    
    from sqlalchemy.dialects.postgresql import insert as pg_insert
    stmt = (
        pg_insert(UserAchievement)
        .values(
            user_id=user_id,
            achievement_id=achievement.id,
        )
        .on_conflict_do_nothing(
            index_elements=["user_id", "achievement_id"]
        )
    )
    await db.execute(stmt)
    
    # Начисляем XP
    if ach_data.get("xp_reward", 0) > 0:
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(xp=User.xp + ach_data["xp_reward"])
        )


async def get_user_achievements(db: AsyncSession, user_id: int) -> List[Dict[str, Any]]:
    """Получить ачивки пользователя"""
    result = await db.execute(
        select(Achievement, UserAchievement.unlocked_at)
        .join(UserAchievement)
        .where(UserAchievement.user_id == user_id)
        .order_by(UserAchievement.unlocked_at.desc())
    )
    return [
        {
            "code": row.Achievement.code,
            "title": row.Achievement.title,
            "description": row.Achievement.description,
            "icon": row.Achievement.icon,
            "category": row.Achievement.category,
            "unlocked_at": row.unlocked_at.isoformat() if row.unlocked_at else None,
        }
        for row in result.all()
    ]
