from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.core.database import init_db, close_db
from app.routers import injections
from app.services import achievements as ach_service
from app.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

app = FastAPI(
    title="USNEE API",
    description="Harm reduction tracker — без осуждения, только факты",
    version="2.0.0",
)

# CORS для Telegram Mini App + localhost dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

from app.telegram_webhook import router as telegram_router, setup_webhook, shutdown_webhook

app.include_router(injections.router)
app.include_router(telegram_router)


@app.on_event("startup")
async def startup():
    logger.info("Starting USNEE API...")
    await init_db()
    # Инициализация ачивок
    async with AsyncSessionLocal() as db:
        await ach_service.init_achievements(db)
    # Установка Telegram webhook (graceful fallback)
    try:
        await setup_webhook()
    except Exception as e:
        logger.warning(f"Webhook setup skipped (expected in dev mode): {e}")
    logger.info("USNEE API started")


@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down USNEE API...")
    try:
        await shutdown_webhook()
    except Exception as e:
        logger.warning(f"Webhook shutdown skipped: {e}")
    await close_db()
    logger.info("USNEE API stopped")


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "2.0.0"}


@app.get("/")
async def root():
    return {"message": "USNEE API — без осуждения, только факты"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "message": "Что-то пошло не так. Попробуй позже."},
    )
