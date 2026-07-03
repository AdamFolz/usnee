import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update

from app.models.models import User

logger = logging.getLogger(__name__)


class GamificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def add_xp(self, user_id: int, amount: int, reason: str = "") -> dict:
        try:
            result = await self.db.execute(
                update(User)
                .where(User.id == user_id)
                .values(xp=User.xp + amount)
                .returning(User.xp)
            )
            new_xp = result.scalar()
            
            # Пересчёт уровня
            new_level = 1 + (new_xp // 100)
            
            await self.db.execute(
                update(User)
                .where(User.id == user_id)
                .where(User.level < new_level)
                .values(level=new_level)
            )
            
            return {"xp": new_xp, "level": new_level}
            
        except Exception as e:
            logger.error(f"Error adding XP: {e}")
            raise