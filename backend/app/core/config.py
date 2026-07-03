from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List, Optional
import secrets
import json


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    # Обязательные поля с валидацией
    bot_token: str = "dev_token"
    database_url: str = "postgresql+asyncpg://usnee:password@postgres/usnee"
    redis_url: str = "redis://redis:6379"
    
    # Безопасность
    encryption_key: str = secrets.token_urlsafe(32)
    secret_key: str = secrets.token_urlsafe(32)
    
    # CORS (критично для Mini App + localhost dev)
    cors_origins: List[str] = [
        "https://*.telegram.org",
        "https://*.usnee.app",
        "http://localhost",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:80",
        "http://localhost:3000",
        "http://127.0.0.1",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ]
    
    # Настройки
    admin_ids: List[int] = []
    webapp_url: str = "https://usnee.app/miniapp"
    webhook_url: str = "https://usnee.app/miniapp"
    
    # Rate limiting (только для защиты сервера)
    rate_limit_requests: int = 10
    rate_limit_window: int = 1
    
    # Логирование
    log_level: str = "INFO"
    
    def model_post_init(self, __context):
        """Parse CORS_ORIGINS from env if it is a JSON string"""
        super().model_post_init(__context)
        import os
        raw = os.environ.get("CORS_ORIGINS")
        if raw and raw.startswith("["):
            try:
                self.cors_origins = json.loads(raw)
            except json.JSONDecodeError:
                pass
    
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
