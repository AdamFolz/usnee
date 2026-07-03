from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
from typing import AsyncGenerator
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Engine с правильными настройками для production
engine = create_async_engine(
    settings.database_url_async,
    echo=False,  # True только для дебага
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,  # Проверяет соединение перед использованием
    pool_recycle=3600,   # Пересоздаёт соединения каждый час
)

# Для тестов или если SQLite не доступен
if "sqlite" in settings.database_url:
    engine = create_async_engine(
        settings.database_url,
        echo=False,
        poolclass=NullPool,  # SQLite не поддерживает пул
    )

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Важно для работы с объектами после коммита
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency для FastAPI с автоматическим rollback при ошибках"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database transaction failed: {e}")
            raise
        finally:
            await session.close()


async def init_db():
    """Инициализация таблиц (для разработки, в production используем Alembic)"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized")


async def close_db():
    """Graceful shutdown"""
    await engine.dispose()
    logger.info("Database connection closed")
