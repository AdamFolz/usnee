# USNEE — Dev Launch Guide

> Запуск локально для тестирования с 1–2 людьми.

## Быстрый старт (Docker)

Самый простой способ — всё через Docker Compose:

```bash
# 1. Запускаем бэкенд + PostgreSQL + Redis
docker-compose -f docker-compose.dev.yml up -d

# 2. В другом терминале — фронтенд
cd usnee-frontend
npm install        # если не установлено
npm run dev
```

Открываем: **http://localhost:5173**

- Backend API: http://localhost:8000
- API Health: http://localhost:8000/health
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## Без Docker (если Python и Node уже установлены)

### Backend (отдельно)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
pip install -r requirements.txt

# Запуск с SQLite (zero-config, no Docker)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

> ⚠️ Без Docker используется SQLite (`dev.env`). PostgreSQL-фичи (типа `pg_insert`) заменены на универсальные.

### Frontend (отдельно)

```bash
cd usnee-frontend
npm install
npm run dev
```

Vite уже настроен с прокси на `http://localhost:8000`.

---

## Авторизация в dev-режиме

Telegram WebApp не нужен. Авторизация работает через **test user**:

- Frontend отправляет заголовок `X-Test-User-Id: 123456789`
- Backend принимает его и создаёт/использует пользователя с `telegram_id=123456789`

Чтобы сменить пользователя (для теста с 2 людьми):
```js
localStorage.setItem('dev_test_user_id', '987654321')
location.reload()
```

---

## Структура проекта

```
USNEE/
├── backend/              # FastAPI + SQLAlchemy + aiogram
│   ├── app/
│   │   ├── main.py       # точка входа API
│   │   ├── routers/      # API endpoints (/api/...)
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # achievements, gamification
│   │   └── core/         # config, security, database
│   ├── bot/              # Telegram bot (polling)
│   └── requirements.txt
├── usnee-frontend/       # React 18 + Vite + Tailwind
│   ├── src/
│   │   ├── App.tsx       # главная точка входа
│   │   ├── components/   # UI компоненты
│   │   ├── api/client.ts # HTTP клиент
│   │   └── stores/       # Zustand store
│   └── vite.config.ts
├── docker-compose.yml     # production-like
├── docker-compose.dev.yml # dev-only (DB + backend)
└── dev.env                # dev переменные окружения
```

---

## Команды

| Команда | Описание |
|---------|----------|
| `docker-compose -f docker-compose.dev.yml up -d` | Запуск backend + DB |
| `docker-compose -f docker-compose.dev.yml down` | Остановка |
| `cd usnee-frontend && npm run dev` | Frontend dev server |
| `cd usnee-frontend && npm run build` | Production build |
| `cd backend && uvicorn app.main:app --reload` | Backend dev server |

---

## Что работает после запуска

- ✅ Запись инъекций (POST /api/inject)
- ✅ Статистика (GET /api/stats)
- ✅ История с пагинацией (GET /api/history)
- ✅ Отмена записи (POST /api/injections/{id}/cancel)
- ✅ Ачивки (автоматически при записи)
- ✅ Геймификация (XP, уровни)
- ✅ Telegram Mini App ready (WebApp.initData)
- ✅ Dev-режим без Telegram (X-Test-User-Id)
