import hmac
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
from fastapi import HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings


def validate_telegram_init_data(init_data: str) -> Optional[Dict[str, Any]]:
    """
    Валидация данных от Telegram WebApp
    https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
    """
    try:
        # Парсим данные
        data_check = {}
        for param in init_data.split('&'):
            if '=' in param:
                key, value = param.split('=', 1)
                data_check[key] = value
        
        # Проверяем hash
        if 'hash' not in data_check:
            return None
        
        hash_value = data_check.pop('hash')
        
        # Сортируем и собираем data_check_string
        data_check_string = '\n'.join(
            f"{k}={v}" for k, v in sorted(data_check.items())
        )
        
        # Считаем секретный ключ
        secret_key = hmac.new(
            b"WebAppData",
            settings.bot_token.encode(),
            hashlib.sha256
        ).digest()
        
        # Проверяем подпись
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if calculated_hash != hash_value:
            return None
        
        # Проверяем время (не старше 24 часов)
        if 'auth_date' in data_check:
            auth_date = datetime.fromtimestamp(int(data_check['auth_date']))
            if datetime.utcnow() - auth_date > timedelta(hours=24):
                return None
        
        # Возвращаем пользовательские данные
        import json
        if 'user' in data_check:
            return json.loads(data_check['user'])
        
        return data_check
        
    except Exception:
        return None


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=7))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm="HS256")


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


async def get_current_user_id(request: Request) -> int:
    """
    Извлекает telegram_id из запроса (из заголовка или cookies)
    В реальном WebApp данные приходят через initData
    """
    # 1. Для разработки: X-Test-User-Id позволяет тестировать без Telegram
    test_user_id = request.headers.get("X-Test-User-Id")
    if test_user_id:
        try:
            return int(test_user_id)
        except ValueError:
            pass
    
    # 2. Для WebApp: данные передаются в заголовке X-Telegram-Init-Data
    init_data = request.headers.get("X-Telegram-Init-Data")
    
    if not init_data:
        # Fallback: Bearer token (для авторизации через API)
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
            payload = verify_token(token)
            if payload and "telegram_id" in payload:
                return payload["telegram_id"]
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_data = validate_telegram_init_data(init_data)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Telegram data",
        )
    
    return int(user_data.get("id"))
