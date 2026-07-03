from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from datetime import datetime
from typing import Optional, List


class InjectionCreate(BaseModel):
    method: str = Field(..., pattern="^(intravenous|intramuscular|subcutaneous)$")
    site: str = Field(..., min_length=1)
    volume_ml: Decimal = Field(..., gt=0)
    trigger: Optional[str] = None
    trigger_note: Optional[str] = None
    batch_id: Optional[int] = None


class CancelRequest(BaseModel):
    reason: Optional[str] = Field(None, max_length=500)


class InjectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    success: bool
    injection_id: int
    new_achievements: List[dict] = []
    message: str


class InjectionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    method: str
    site: str
    volume_ml: Decimal
    trigger: Optional[str] = None
    trigger_note: Optional[str] = None
    injected_at: datetime
    is_cancelled: bool


class StatsResponse(BaseModel):
    daily_count: int = 0
    avg_interval: Optional[float] = None
    last_injection_ago: Optional[str] = None
    top_trigger: Optional[str] = None
    total_xp: int = 0
    level: int = 1


class HistoryResponse(BaseModel):
    items: List[InjectionOut]
    next_cursor: Optional[str] = None
    has_more: bool


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    xp: int = 0
    level: int = 1
    recent_achievements: List[dict] = []
