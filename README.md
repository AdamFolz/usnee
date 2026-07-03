# USNEE v2.0

**Harm reduction companion — без осуждения, только факты.**

USNEE (ЮЗНИ) — это Telegram Mini App + Bot для людей, которые хотят отслеживать свои паттерны употребления, без давления и оценочных суждений. Ироничные ачивки, анонимная статистика, экстренная помощь.

---

## Стек

| Слой | Технология |
|------|------------|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Backend | FastAPI + SQLAlchemy 2.0 (async) + PostgreSQL |
| Bot | aiogram 3.x |
| Cache | Redis |
| DevOps | Docker Compose + Nginx + GitHub Actions |

---

## Быстрый старт

```bash
# 1. Клонировать
git clone <repo>
cd usnee

# 2. Настроить окружение
cp .env.example .env
# Редактировать .env

# 3. Запустить всё
docker-compose up -d

# 4. Инициализировать ачивки
docker-compose exec backend python -c "from app.main import init_db; import asyncio; asyncio.run(init_db())"
```

---

## Структура проекта

```
usnee/
├── .env.example
├── docker-compose.yml
├── rfc-decisions.md
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.bot
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint
│   │   ├── core/
│   │   │   ├── config.py        # Pydantic Settings
│   │   │   ├── database.py      # SQLAlchemy engine + session
│   │   │   └── security.py      # Telegram WebApp auth + JWT
│   │   ├── models/
│   │   │   └── models.py        # User, Batch, Injection, Achievement
│   │   ├── routers/
│   │   │   └── injections.py    # API endpoints
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic schemas
│   │   └── services/
│   │       └── achievements.py  # Ироничные ачивки (event-driven)
│   └── bot/
│       └── main.py              # Telegram Bot
├── usnee-frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   └── client.ts      # Axios + Telegram auth
│       ├── stores/
│       │   └── appStore.ts      # Zustand
│       ├── components/
│       │   ├── TriggerSelector.tsx
│       │   ├── StatsCard.tsx
│       │   ├── IronicBadge.tsx
│       │   ├── AchievementPopup.tsx
│       │   ├── EmergencyHelp.tsx
│       │   ├── HistoryList.tsx
│       │   ├── BreathingExercise.tsx
│       │   └── ErrorToast.tsx
│       └── types/
│           └── index.ts
└── nginx/
    └── nginx.conf
```

---

## Принципы

- **Никаких ограничений** — не блокируем, не ругаем
- **Ирония ≠ издёвка** — шутки про ситуацию, не про человека
- **Анонимность превыше всего** — никаких ID, никаких следов
- **Информация ≠ повод для стыда** — нейтральные факты
- **Свобода выбора** — пользователь решает сам

---

## Лицензия

MIT
