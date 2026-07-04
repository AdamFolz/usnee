from sqlalchemy import (
    Column, Integer, String, DateTime, Numeric, ForeignKey, 
    Text, Boolean, Index, CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    telegram_id = Column(Integer, unique=True, nullable=False, index=True)
    username = Column(String(255))
    first_name = Column(String(255))
    last_name = Column(String(255))
    
    # Геймификация
    xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)
    
    # Статус
    is_active = Column(Boolean, default=True, nullable=False)
    is_blocked = Column(Boolean, default=False, nullable=False)  # Для модерации
    
    # Метки времени
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Отношения
    injections = relationship("Injection", back_populates="user", lazy="dynamic")
    batches = relationship("Batch", back_populates="user", lazy="dynamic")
    achievements = relationship("UserAchievement", back_populates="user")
    
    # Индексы для частых запросов
    __table_args__ = (
        Index('idx_user_active', 'is_active', 'telegram_id'),
    )


class Batch(Base):
    __tablename__ = "batches"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Параметры партии
    total_amount = Column(Numeric(10, 2), nullable=False)
    remaining_amount = Column(Numeric(10, 2), nullable=False)
    drug_name = Column(String(255))  # Опционально
    
    # Статус
    is_active = Column(Boolean, default=True, nullable=False)
    is_finished = Column(Boolean, default=False)
    finished_at = Column(DateTime(timezone=True))
    
    # Метки времени
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Отношения
    user = relationship("User", back_populates="batches")
    injections = relationship("Injection", back_populates="batch")
    
    # Ограничения целостности
    __table_args__ = (
        CheckConstraint('remaining_amount >= 0', name='check_remaining_positive'),
        CheckConstraint('total_amount > 0', name='check_total_positive'),
    )


class Injection(Base):
    __tablename__ = "injections"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id", ondelete="SET NULL"), nullable=True, index=True)
    
    # Параметры инъекции
    method = Column(String(50), nullable=False)  # intravenous, intramuscular, subcutaneous
    site = Column(String(50), nullable=False)    # left_arm, right_arm, etc.
    volume_ml = Column(Numeric(5, 2), nullable=False)
    
    # Триггер (опционально)
    trigger = Column(String(50))  # stress, boredom, pain, etc.
    trigger_note = Column(Text)
    
    # Статус
    is_cancelled = Column(Boolean, default=False, nullable=False)
    cancelled_at = Column(DateTime(timezone=True))
    cancel_reason = Column(Text)
    
    # Метки времени
    injected_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Отношения
    user = relationship("User", back_populates="injections")
    batch = relationship("Batch", back_populates="injections")
    
    # Индексы для аналитики
    __table_args__ = (
        Index('idx_injection_user_time', 'user_id', 'injected_at'),
        Index('idx_injection_trigger', 'trigger'),
        Index('idx_injection_cancelled', 'is_cancelled', 'user_id'),
        CheckConstraint('volume_ml > 0', name='check_volume_positive'),
    )


class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(10), default="🏆")
    xp_reward = Column(Integer, default=0, nullable=False)
    category = Column(String(50), nullable=False)  # ironic, positive, neutral
    is_hidden = Column(Boolean, default=False)  # Секретные ачивки
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id", ondelete="CASCADE"), nullable=False)
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Уникальность: один пользователь — одна ачивка
    __table_args__ = (
        UniqueConstraint('user_id', 'achievement_id', name='uq_user_achievement'),
        Index('idx_user_achievements_user', 'user_id'),
        Index('idx_user_achievements_unlocked', 'unlocked_at'),
    )
    
    # Отношения
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")


class InjectionStats(Base):
    """Предварительно агрегированная статистика для быстрого доступа"""
    __tablename__ = "injection_stats"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Счётчики
    total_injections = Column(Integer, default=0)
    total_volume_ml = Column(Numeric(10, 2), default=0)
    
    # Время
    first_injection_at = Column(DateTime(timezone=True))
    last_injection_at = Column(DateTime(timezone=True))
    avg_interval_hours = Column(Numeric(5, 2))
    
    # Триггеры (JSON или отдельная таблица если нужна детализация)
    top_trigger = Column(String(50))
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
