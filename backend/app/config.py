from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import List
import secrets


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    bot_token: str
    database_url: str = "postgresql+asyncpg://sekov:password@postgres/sekov"
    redis_url: str = "redis://redis:6379"
    
    encryption_key: str = secrets.token_urlsafe(32)
    secret_key: str = secrets.token_urlsafe(32)
    
    cors_origins: List[str] = ["https://*.telegram.org", "https://*.sekov.app"]
    admin_ids: List[int] = []
    webapp_url: str = "https://sekov.app/miniapp"
    
    rate_limit_requests: int = 10
    rate_limit_window: int = 1
    log_level: str = "INFO"
    
    @property
    def database_url_async(self) -> str:
        if "asyncpg" not in self.database_url:
            return self.database_url.replace("postgresql://", "postgresql+asyncpg://")
        return self.database_url


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()