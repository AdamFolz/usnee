from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List
import secrets


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    # Обязательные поля с валидацией
    bot_token: str
    database_url: str = "postgresql+asyncpg://usnee:password@postgres/usnee"
    redis_url: str = "redis://redis:6379"
    
    # Безопасность
    encryption_key: str = secrets.token_urlsafe(32)
    secret_key: str = secrets.token_urlsafe(32)
    
    # CORS (критично для Mini App)
    cors_origins: List[str] = ["https://*.telegram.org", "https://*.usnee.app"]
    
    # Настройки
    admin_ids: List[int] = []
    webapp_url: str = "https://usnee.app/miniapp"
    
    # Rate limiting (только для защиты сервера)
    rate_limit_requests: int = 10
    rate_limit_window: int = 1
    
    # Логирование
    log_level: str = "INFO"
    
    @property
    def database_url_async(self) -> str:
        """Убеждаемся что используется async драйвер"""
        if "asyncpg" not in self.database_url:
            return self.database_url.replace("postgresql://", "postgresql+asyncpg://")
        return self.database_url


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
