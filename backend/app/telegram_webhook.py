import logging
import sys
from fastapi import APIRouter, Request

sys.path.append('/app')

from aiogram import Bot, Dispatcher
from aiogram.types import Message, Update, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command

from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/telegram", tags=["bot"])

bot = Bot(token=settings.bot_token)
dp = Dispatcher()


@dp.message(Command("start"))
async def cmd_start(message: Message):
    """Приветствие с кнопкой Mini App"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть USNEE",
                    web_app={"url": settings.webapp_url},
                )
            ]
        ]
    )
    await message.answer(
        "Привет. USNEE — это твой помощник без осуждения.\n\n"
        "Мы не говорим 'бросай'. Мы помогаем видеть паттерны "
        "и снижать вред, если ты сам этого хочешь.\n\n"
        "Все данные шифруются. Никаких следов.",
        reply_markup=keyboard,
    )


@dp.message(Command("help"))
async def cmd_help(message: Message):
    """Экстренная помощь"""
    await message.answer(
        "🆘 Экстренная помощь (анонимно):\n\n"
        "• Телефон доверия: 8-800-2000-122\n"
        "• Наркологическая помощь: 103\n"
        "• Чат поддержки: @anon_help_bot\n\n"
        "Ты не один. Мы рядом."
    )


@dp.message(Command("stats"))
async def cmd_stats(message: Message):
    """Ссылка на Mini App"""
    await message.answer(
        "📊 Статистика доступна в Mini App. Нажми кнопку ниже."
    )


async def setup_webhook():
    """Установить Telegram webhook при старте"""
    webhook_url = f"{settings.webapp_url}/api/telegram/webhook"
    try:
        await bot.set_webhook(url=webhook_url)
        logger.info(f"Webhook set to {webhook_url}")
    except Exception as e:
        logger.error(f"Failed to set webhook: {e}")


async def shutdown_webhook():
    """Удалить webhook при остановке"""
    try:
        await bot.delete_webhook()
        await bot.session.close()
        logger.info("Webhook deleted")
    except Exception as e:
        logger.error(f"Failed to delete webhook: {e}")


@router.post("/webhook")
async def telegram_webhook(request: Request):
    """Получать обновления от Telegram"""
    data = await request.json()
    update = Update.model_validate(data)
    await dp.feed_update(bot=bot, update=update)
    return {"ok": True}
