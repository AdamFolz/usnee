import logging
from fastapi import APIRouter, Request

from aiogram import Bot, Dispatcher
from aiogram.types import Message, Update, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import Command

from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/telegram", tags=["bot"])

# Lazy init — чтобы при отсутствии/невалидном BOT_TOKEN приложение не падало на старте
_bot: Bot | None = None
_dp = Dispatcher()


def _get_bot() -> Bot:
    global _bot
    if _bot is None:
        try:
            _bot = Bot(token=settings.bot_token)
        except Exception as e:
            logger.warning(f"Bot init failed (token invalid or missing): {e}")
            raise
    return _bot


def get_bot() -> Bot | None:
    try:
        return _get_bot()
    except Exception:
        return None


@_dp.message(Command("start"))
async def cmd_start(message: Message):
    """Приветствие с кнопкой Mini App"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть USNEE",
                    web_app=WebAppInfo(url=settings.webapp_url),
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


@_dp.message(Command("help"))
async def cmd_help(message: Message):
    """Экстренная помощь"""
    await message.answer(
        "🆘 Экстренная помощь (анонимно):\n\n"
        "• Телефон доверия: 8-800-2000-122\n"
        "• Наркологическая помощь: 103\n"
        "• Чат поддержки: @anon_help_bot\n\n"
        "Ты не один. Мы рядом."
    )


@_dp.message(Command("stats"))
async def cmd_stats(message: Message):
    """Ссылка на Mini App"""
    await message.answer(
        "📊 Статистика доступна в Mini App. Нажми кнопку ниже."
    )


async def setup_webhook():
    """Установить Telegram webhook при старте"""
    bot = get_bot()
    if bot is None:
        logger.warning("Webhook setup skipped: bot not initialized")
        return
    webhook_url = f"{settings.webhook_url}/api/telegram/webhook"
    try:
        await bot.set_webhook(url=webhook_url)
        logger.info(f"Webhook set to {webhook_url}")
    except Exception as e:
        logger.error(f"Failed to set webhook: {e}")


async def shutdown_webhook():
    """Удалить webhook при остановке"""
    bot = get_bot()
    if bot is None:
        return
    try:
        await bot.delete_webhook()
        await bot.session.close()
        logger.info("Webhook deleted")
    except Exception as e:
        logger.error(f"Failed to delete webhook: {e}")


@router.post("/webhook")
async def telegram_webhook(request: Request):
    """Получать обновления от Telegram"""
    bot = get_bot()
    if bot is None:
        return {"ok": False, "error": "Bot not initialized"}
    data = await request.json()
    update = Update(**data)
    await _dp.feed_update(bot=bot, update=update)
    return {"ok": True}
