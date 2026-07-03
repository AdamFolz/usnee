import logging
import sys

sys.path.append('/app')

from aiogram import Bot, Dispatcher
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram.filters import Command
from aiogram.enums import ParseMode

from app.core.config import settings

logger = logging.getLogger(__name__)

bot = Bot(token=settings.bot_token, parse_mode=ParseMode.HTML)
dp = Dispatcher()


@dp.message(Command("start"))
async def cmd_start(message: Message):
    """Приветствие без осуждения"""
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
    """Помощь"""
    await message.answer(
        "🆘 Экстренная помощь (анонимно):\n\n"
        "• Телефон доверия: 8-800-2000-122\n"
        "• Наркологическая помощь: 103\n"
        "• Чат поддержки: @anon_help_bot\n\n"
        "Ты не один. Мы рядом."
    )


@dp.message(Command("stats"))
async def cmd_stats(message: Message):
    """Быстрая статистика через бота"""
    await message.answer(
        "📊 Статистика доступна в Mini App.\n\n"
        "Нажми кнопку ниже, чтобы открыть приложение:"
    )


@dp.callback_query()
async def on_callback(callback: CallbackQuery):
    await callback.answer()


async def main():
    logger.info("Starting Telegram Bot...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
