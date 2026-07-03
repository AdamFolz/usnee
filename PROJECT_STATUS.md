# USNEE (ЮЗНИ) — Состояние проекта v2.0

> **Актуально на:** 2024-07-02 (обновлено после swarm-интеграции + деплой-конфиг)  
> **Статус:** Backend — ЗАКРЫТ, Frontend — Интегрирован, Bot — Интегрирован, **Деплой — Готов к Railway+Vercel**  
> **Философия:** "Без осуждения, только факты" — harm reduction companion

---

## 1. Общая информация

**Назначение:** Telegram Mini App + Bot для безопасного отслеживания инъекций без осуждения  
**Целевая аудитория:** Люди, практикующие снижение вреда (harm reduction)  
**Платформа:** Telegram Mini App (WebView) + веб-версия  
**Масштаб:** MVP — только инъекции (IV/IM/SC), без других способов употребления

---

## 2. Технический стек

### Backend
| Компонент | Технология | Версия | Обоснование |
|-----------|-----------|--------|-------------|
| Framework | FastAPI | 0.109+ | Async native, auto-docs, Pydantic |
| Database | PostgreSQL | 16 | Надёжность, конкурентность |
| ORM | SQLAlchemy | 2.0+ | Type safety, async support |
| Migrations | Alembic | 1.13+ | Version control for schema |
| Validation | Pydantic | 2.0+ | Runtime + static type safety |
| Auth | Telegram WebApp | — | HMAC-SHA256 validation |
| Bot | aiogram | 3.x | Async Telegram Bot API |

### Frontend
| Компонент | Технология | Версия | Обоснование |
|-----------|-----------|--------|-------------|
| Framework | React | 18.2+ | Concurrent features |
| Language | TypeScript | 5.2+ | Type safety |
| Routing | React Router DOM | 6.21+ | Standard, sufficient |
| State (Client) | Zustand | 4.5+ | Minimal boilerplate |
| State (Server) | React Query | 5.17+ | Caching, retry, invalidation |
| Forms | React Hook Form | 7.49+ | Performance, less re-renders |
| Validation | Zod | 3.22+ | Runtime + type safety |
| Styling | Tailwind CSS | 3.4+ | Utility-first, fast |
| UI Components | Headless UI | 1.7+ | Accessible primitives |
| Icons | Lucide React | 0.312+ | Tree-shakeable |
| Build Tool | Vite | 5.0+ | Fast HMR, optimized builds |
| Telegram SDK | @telegram-apps/sdk | 1.0+ | Official, maintained |

### DevOps
| Компонент | Технология | Обоснование |
|-----------|-----------|-------------|
| Containerization | Docker + Docker Compose | Единая среда разработки |
| Reverse Proxy | nginx | Статика + API проксирование |
| CI/CD | GitHub Actions (скелет) | Автоматизация сборки |

---

## 3. Архитектура

### Backend Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Telegram   │────▶│   FastAPI   │────▶│  PostgreSQL │
│   WebApp    │     │   Backend   │     │   (Data)    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Alembic   │
                    │ (Migrations)│
                    └─────────────┘
```

**Ключевые паттерны:**
- **Optimistic locking** для Batch (atomic UPDATE с проверкой `remaining_amount >= volume_ml`)
- **INSERT ... ON CONFLICT** для idempotency (пользователи, ачивки)
- **Cursor-based пагинация** (без OFFSET, через `injected_at < cursor`)
- **Event-driven ачивки** — проверка только при создании инъекции, никакой ретроспективы
- **Атомарные операции** — вся логика в одной транзакции, управляемой endpoint'ом

### Frontend Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Telegram   │────▶│   React     │────▶│ React Query │
│   WebView   │     │  + Zustand  │     │(Server State)│
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Tailwind   │
                    │ + Headless  │
                    │     UI      │
                    └─────────────┘
```

**Ключевые паттерны:**
- Server state → React Query (кэш 60s, retry 2, refetchOnWindowFocus: false)
- Client state → Zustand (persist в localStorage)
- Forms → React Hook Form + Zod resolver
- Theme → Только dark mode (align with Telegram), CSS variables + Tailwind `dark:`
- Bundle size ≤ 200KB gzip (code splitting по чанкам: vendor, query, state, forms, ui)

---

## 4. Структура проекта

```
usnee/
├── docker-compose.yml          # Инфраструктура (PG, Redis, Backend, Bot, nginx)
├── .env.example                # Шаблон переменных окружения
├── PROJECT_CONTEXT.md          # Единый источник истины о проекте
├── README.md                   # Общее описание
├── ROADMAP.md                  # План развития (фазы 1-8)
├── rfc-decisions.md            # Принятые архитектурные решения
├── backend/                    # Python FastAPI
│   ├── Dockerfile
│   ├── Dockerfile.bot
│   ├── requirements.txt
│   ├── alembic.ini
│   └── app/
│       ├── main.py             # Entry point + lifespan manager
│       ├── config.py           # Pydantic Settings (.env)
│       ├── database.py         # SQLAlchemy async engine + sessions
│       ├── models/
│       │   └── models.py       # SQLAlchemy models (User, Batch, Injection, Achievement, UserAchievement)
│       ├── schemas/
│       │   └── schemas.py      # Pydantic schemas (InjectionCreate, InjectionResponse, StatsResponse, AchievementSchema)
│       ├── routers/
│       │   └── injections.py   # API endpoints (/inject, /stats, /history, /me, /cancel)
│       ├── services/
│       │   ├── achievements.py  # AchievementChecker (event-driven, 8 ачивок)
│       │   └── gamification.py # GamificationService (XP + level)
│       └── core/
│           ├── config.py       # Pydantic Settings
│           ├── database.py     # Engine + session factory
│           └── security.py     # Telegram WebApp HMAC-SHA256 auth
│   └── bot/
│       └── main.py             # aiogram 3.x Bot (/start, /help, /stats)
│
├── usnee-frontend/             # React + TypeScript (renamed from sekov-frontend)
│   ├── Dockerfile              # nginx образ со статикой
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts          # Alias @/*, build config
│   ├── tailwind.config.js      # USNEE color palette (glassmorphism dark theme)
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx            # Entry point
│       ├── App.tsx             # Main app (3 tabs, injection form, stats, history, settings)
│       ├── api/
│       │   └── client.ts       # Axios wrapper + Telegram auth header
│       ├── components/
│       │   ├── AchievementPopup.tsx
│       │   ├── BreathingExercise.tsx
│       │   ├── EmergencyHelp.tsx
│       │   ├── ErrorToast.tsx
│       │   ├── HistoryList.tsx
│       │   ├── IronicBadge.tsx
│       │   ├── StatsCard.tsx
│       │   └── TriggerSelector.tsx
│       ├── stores/
│       │   └── appStore.ts     # Zustand store (user, stats, history, injections)
│       ├── types/
│       │   └── index.ts        # TypeScript interfaces
│       └── styles/
│           └── index.css       # Tailwind + custom utilities (glass, text-gradient, btn-primary)
```

---

## 5. Swarm-интеграция (выполнено)

### Backend Alignment (воркер 1)
| Изменение | Файл | Статус |
|-----------|------|--------|
| Добавлен `POST /api/injections/{id}/cancel` endpoint | `backend/app/routers/injections.py` | ✅ |
| Добавлен `CancelRequest` schema | `backend/app/schemas/schemas.py` | ✅ |
| Удалён дублирующий файл | `backend/app/api/injections.py` | ✅ Удалён |
| Проверена схема `User` (first_name, username) | `backend/app/models/models.py` | ✅ Уже существует |
| Верификация всех схем Frontend ↔ Backend | — | ✅ Совпадают |

### Frontend Alignment (воркер 2)
| Изменение | Файл | Статус |
|-----------|------|--------|
| Переименована цветовая палитра `sekov` → `usnee` | `usnee-frontend/tailwind.config.js` | ✅ |
| Проверка API client cancel endpoint | `usnee-frontend/src/api/client.ts` | ✅ Уже корректен |
| Проверка custom CSS классов | `usnee-frontend/src/index.css` | ✅ Все определены |
| Проверка Zustand store consistency | `usnee-frontend/src/stores/appStore.ts` | ✅ Корректен |

### Bot & Docker Integration (воркер 3)
| Изменение | Файл | Статус |
|-----------|------|--------|
| Исправлены импорты бота (PYTHONPATH) | `backend/bot/main.py` | ✅ `sys.path.append('/app')` |
| Добавлен `PYTHONPATH=/app` | `backend/Dockerfile.bot` | ✅ |
| Синхронизированы env-переменные | `docker-compose.yml` | ✅ ENCRYPTION_KEY, SECRET_KEY добавлены |
| Добавлен `SECRET_KEY` | `.env.example` | ✅ |

---

## 6. Модели данных

### User (users)
| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | Integer | PK | Автоинкремент |
| telegram_id | Integer | UNIQUE, NOT NULL, INDEX | Telegram user ID |
| username | String(255) | nullable | Telegram username |
| first_name | String(255) | nullable | Telegram first name |
| xp | Integer | DEFAULT 0, NOT NULL | Опыт |
| level | Integer | DEFAULT 1, NOT NULL | Уровень |
| is_active | Boolean | DEFAULT TRUE | Активен |
| created_at | DateTime | server_default=now() | Дата регистрации |

### Batch (batches) — Партия препарата
| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | Integer | PK | Автоинкремент |
| user_id | Integer | FK(users), CASCADE, INDEX | Владелец |
| total_amount | Numeric(10,2) | NOT NULL | Общий объём |
| remaining_amount | Numeric(10,2) | NOT NULL | Остаток |
| is_active | Boolean | DEFAULT TRUE | Активна |
| is_finished | Boolean | DEFAULT FALSE | Завершена |
| finished_at | DateTime | | Время завершения |
| created_at | DateTime | server_default=now() | Дата создания |

**Constraints:** `remaining_amount >= 0`, `total_amount > 0`

### Injection (injections) — Запись об инъекции
| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | Integer | PK | Автоинкремент |
| user_id | Integer | FK(users), CASCADE, INDEX | Кто |
| batch_id | Integer | FK(batches), SET NULL, INDEX | Из какой партии |
| method | String(50) | NOT NULL | Способ: intravenous/intramuscular/subcutaneous |
| site | String(50) | NOT NULL | Место инъекции |
| volume_ml | Numeric(5,2) | NOT NULL | Объём в мл |
| trigger | String(50) | | Триггер (причина) |
| trigger_note | Text | | Заметка о триггере |
| is_cancelled | Boolean | DEFAULT FALSE | Отменена (soft delete) |
| cancelled_at | DateTime | | Время отмены |
| cancel_reason | Text | | Причина отмены |
| injected_at | DateTime | server_default=now(), NOT NULL | Время инъекции |

**Indexes:** `idx_injection_user_time` (user_id, injected_at)  
**Constraint:** `volume_ml > 0`

### Achievement (achievements) — Достижение
| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | Integer | PK | Автоинкремент |
| code | String(50) | UNIQUE, NOT NULL, INDEX | Код ачивки |
| title | String(255) | NOT NULL | Название |
| description | Text | NOT NULL | Описание |
| icon | String(10) | DEFAULT "🏆" | Эмодзи |
| xp_reward | Integer | DEFAULT 0 | XP бонус |
| category | String(50) | NOT NULL | ironic / positive |
| created_at | DateTime | server_default=now() | |

### UserAchievement (user_achievements) — Связь пользователя и ачивки
| Поле | Тип | Ограничения | Описание |
|------|-----|-------------|----------|
| id | Integer | PK | Автоинкремент |
| user_id | Integer | FK(users), CASCADE, NOT NULL | |
| achievement_id | Integer | FK(achievements), CASCADE, NOT NULL | |
| unlocked_at | DateTime | server_default=now() | Время получения |

**Constraints:** `UNIQUE(user_id, achievement_id)` — `uq_user_achievement`  
**Indexes:** `idx_user_achievements_user`, `idx_user_achievements_unlocked`

---

## 7. API Endpoints

### Аутентификация
Все endpoints требуют заголовок `X-Telegram-Init-Data: <telegram_init_data>`  
Валидация: HMAC-SHA256 с `WebAppData` + `bot_token`

### Создание инъекции
```http
POST /api/inject
Content-Type: application/json
X-Telegram-Init-Data: <init_data>

{
  "method": "intravenous" | "intramuscular" | "subcutaneous",
  "site": "string (1-50 chars)",
  "volume_ml": "number (0 < x <= 100, max 2 decimals)",
  "trigger": "string? (enum: stress|boredom|company|pain|habit|celebration|withdrawal|experiment|no_reason)",
  "note": "string? (max 1000 chars)",
  "batch_id": "number?"
}
```

**Response 200:**
```json
{
  "success": true,
  "injection_id": 123,
  "new_achievements": [],
  "message": "Записано ✓"
}
```

**Ошибки:** 400 (validation), 403 (batch чужой), 404 (batch не найден), 503 (БД недоступна)

### Получение статистики
```http
GET /api/stats
X-Telegram-Init-Data: <init_data>
```

**Response 200:**
```json
{
  "daily_count": 3,
  "avg_interval": 4.5,
  "last_injection_ago": "2 часа назад",
  "top_trigger": "stress",
  "total_xp": 420,
  "level": 5
}
```

### История (cursor-based пагинация)
```http
GET /api/history?cursor=2024-07-01T00:00:00&limit=50
X-Telegram-Init-Data: <init_data>
```

**Response 200:**
```json
{
  "items": [Injection],
  "next_cursor": "2024-06-30T23:55:00",
  "has_more": true
}
```

**Важно:** Поле `total` удалено — производительность при больших объёмах. `has_more` определяется через `limit + 1` запрос.

### Отмена инъекции (soft delete)
```http
POST /api/injections/{id}/cancel
Content-Type: application/json
X-Telegram-Init-Data: <init_data>

{
  "reason": "string? (max 500 chars)"
}
```

**Response 200:** `{"success": true, "message": "Запись отменена"}`

**Ошибки:** 404 (не найдена или уже отменена)

### Получение текущего пользователя
```http
GET /api/me
X-Telegram-Init-Data: <init_data>
```

**Response 200:**
```json
{
  "telegram_id": 123456789,
  "username": "user",
  "first_name": "Иван",
  "xp": 420,
  "level": 5,
  "recent_achievements": []
}
```

---

## 8. Ачивки (Event-driven)

| Код | Название | Условие | XP | Категория |
|-----|----------|---------|-----|-----------|
| still_alive | Ого, ты всё ещё живой | 5 инъекций за день | 10 | ironic |
| work_tomorrow | Надеюсь, завтра не на работу | 3 ночные (00-06) | 15 | ironic |
| barely_breathing | Еле-еле | Интервал < 1 часа | 5 | ironic |
| to_infinity | Бесконечность не предел | 10 за сутки | 20 | ironic |
| vampire | Ночная смена | Все инъекции ночью | 15 | ironic |
| speedrun | Спидраннер | 3 инъекции в течение 1 часа | 25 | ironic |
| marathon | Марафонец | 24 часа с инъекциями каждый час | 50 | ironic |
| collector | Коллекционер | 5 разных мест | 10 | ironic |
| pharmacist | Аптечка-тоска | Партия за 1 день | 30 | ironic |
| architect | Архитектор | Запланировал партию заранее | 20 | positive |
| diary | Писатель | 3 заметки о триггерах | 15 | positive |

**Ключевые решения:**
- Ачивки проверяются **только при создании инъекции** (event-bound evaluation)
- **Нет ретроспективной проверки** — если условие выполнилось в прошлом, но ачивка не выдалась, она не выдаётся потом
- **Speedrun:** проверяет 3 последние инъекции в окне 1 часа от текущей
- **Marathon:** проверяет 24 разных часовых слота UTC за последние 24 часа
- **Idempotency:** `ON CONFLICT DO NOTHING` на `UNIQUE(user_id, achievement_id)`
- **Транзакционность:** INSERT ачивки + UPDATE XP в одной транзакции

---

## 9. Геймификация

- **XP:** 10 за каждую инъекцию
- **Уровень:** `1 + XP // 100`
- **Без синков:** XP накапливается бесконечно, нет механизма траты
- **Балансировка:** отложена на post-release через аналитику

---

## 10. Конфигурация окружения

### Backend `.env`
```bash
BOT_TOKEN=your_telegram_bot_token
DB_PASSWORD=strong_password_here
ENCRYPTION_KEY=base64_encoded_32_bytes
SECRET_KEY=random_secret_for_jwt
WEBAPP_URL=https://your-domain.com/miniapp
CORS_ORIGINS=["https://*.telegram.org","https://your-domain.com"]
```

### Frontend `.env.local`
```bash
VITE_API_URL=http://localhost:8000
VITE_BOT_USERNAME=your_bot_username
```

### Docker Compose переменные
```bash
POSTGRES_USER=usnee
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=usnee
DATABASE_URL=postgresql+asyncpg://usnee:${DB_PASSWORD}@postgres/usnee
```

---

## 11. Безопасность

| Уровень | Мера | Статус |
|---------|------|--------|
| Аутентификация | Telegram WebApp HMAC-SHA256 | ✅ Реализовано |
| Авторизация | Только собственные данные пользователя | ✅ Реализовано |
| CORS | Strict, только `*.telegram.org` и домен приложения | ✅ Реализовано |
| Input Validation | Pydantic (backend) + Zod (frontend) | ✅ Реализовано |
| SQL Injection | Исключено (SQLAlchemy ORM, parameterized queries) | ✅ Исключено |
| XSS | Content-Security-Policy (через nginx) | 🟡 Частично |
| Rate Limiting | Только Nginx (server-side валидация) | 🟡 Отложено |
| Encryption | Fernet для sensitive полей | 🟡 Отложено |

---

## 12. Технический долг

| Проблема | Уровень | Статус | Комментарий |
|----------|---------|--------|-------------|
| Тесты (unit/E2E) | 🔴 Высокий | ❌ Нет | Vitest + Playwright запланированы |
| CI/CD pipeline | 🔴 Высокий | ❌ Нет | GitHub Actions скелет существует |
| Bundle size monitoring | 🟡 Средний | ❌ Нет | Нет автоматической проверки |
| Error tracking (Sentry) | 🟡 Средний | ❌ Нет | Только console.error |
| Analytics (Amplitude/Mixpanel) | 🟡 Средний | ❌ Нет | Нет интеграции |
| Accessibility (WCAG) | 🟡 Средний | ❌ Нет | Только базовый уровень |
| Offline mode (Service Worker) | 🟡 Средний | ❌ Нет | Только localStorage cache |
| Rate limiting (API) | 🟡 Средний | ❌ Нет | Только Nginx, без Redis |
| Redis cache для /stats | 🟡 Средний | ❌ Нет | Запланировано при 10k users |
| CDN для статики | 🟢 Низкий | ❌ Нет | Запланировано при 100k users |
| Read replicas PostgreSQL | 🟢 Низкий | ❌ Нет | Запланировано при 100k users |
| Шардирование по user_id | 🟢 Низкий | ❌ Нет | Запланировано при 1M users |

---

## 13. Роадмап (фазы)

| Фаза | Статус | Описание |
|------|--------|----------|
| **1. MVP** | ✅ Завершено | Инъекции (IV/IM/SC), базовая статистика, ачивки |
| **2. Метрики** | ⏳ Запланировано | Детальная аналитика, визуализация трендов |
| **3. Планирование** | ⏳ Запланировано | Предупреждения о перерывах, безопасные дозировки |
| **4. Сообщество** | ⏳ Запланировано | Поддержка, безопасные зоны, экстренная помощь |
| **5. Другие способы** | ⏳ Запланировано | Курение, орально, нюхание, ингаляция, ректально, трансдермально |
| **6. Классификация ПАВ** | ⏳ Запланировано | Опиоиды, стимуляторы, диссоциативы, каннабиноиды, седативы, психоделики, ДОК |
| **7. Кастомизация** | ⏳ Запланировано | Пользовательские ачивки, триггеры, уведомления |
| **8. Продакшен** | ⏳ Запланировано | Мониторинг, масштабирование, безопасность |

---

## 14. Инструкции по развертыванию

### Быстрый старт (Docker Compose)
```bash
# 1. Клонировать репозиторий
git clone https://github.com/AdamFolz/SEKSOV-.git

# 2. Создать .env файл
cp .env.example .env
# Отредактировать: BOT_TOKEN, DB_PASSWORD, ENCRYPTION_KEY, SECRET_KEY, WEBAPP_URL

# 3. Запустить
docker-compose up -d

# 4. Открыть
curl http://localhost:8000/health
```

### Frontend (локальная разработка)
```bash
cd usnee-frontend
npm install
npm run dev
# Открыть http://localhost:5173
```

### Backend (локальная разработка без Docker)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# API docs: http://localhost:8000/docs
```

---

## 15. Деплой в облако (Railway + Vercel)

Для автономной работы бота 24/7 без вашего ПК.

### Архитектура деплоя
```
┌─────────────┐     ┌─────────────────────────────┐     ┌─────────────┐
│   Telegram  │────▶│  Railway (Backend + Bot)    │────▶│  PostgreSQL │
│   Servers   │     │  • FastAPI API              │     │  (Railway)  │
│             │     │  • aiogram Webhook          │     │  500 MB     │
└─────────────┘     └─────────────────────────────┘     └─────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Vercel (Frontend│
                    │  Mini App)      │
                    │  Бесплатно      │
                    └─────────────────┘
```

### Файлы для деплоя (созданы)
| Файл | Назначение |
|------|-----------|
| `railway.json` | Конфиг Railway (Docker build + deploy) |
| `usnee-frontend/vercel.json` | Конфиг Vercel (Vite build) |
| `backend/app/telegram_webhook.py` | Webhook endpoint для aiogram |
| `DEPLOY_RAILWAY.md` | Пошаговая инструкция по деплою |

### Стоимость
| Сервис | Бесплатно | Платно |
|--------|-----------|--------|
| Railway (Backend + Бот) | $5 кредитов/мес | $5-10/мес |
| Railway PostgreSQL | 500 MB | $0 |
| Vercel (Frontend) | Безлимитно | $0 |

### Инструкция
Подробная инструкция в [`DEPLOY_RAILWAY.md`](DEPLOY_RAILWAY.md):
1. Создать бота в @BotFather → получить токен
2. Загрузить код на GitHub
3. Railway: деплой backend + PostgreSQL + env vars
4. Vercel: деплой frontend + env vars
5. Настроить Mini App URL в @BotFather
6. Готово — бот работает 24/7

---

## 16. Swarm-интеграция: детали изменений

### Backend (воркер 1)
**Добавлен endpoint отмены инъекции:**
- `POST /api/injections/{id}/cancel` с телом `{ "reason": "string" }`
- Использует optimistic locking (`UPDATE ... WHERE is_cancelled=False`)
- Восстанавливает `remaining_amount` батча при отмене
- Добавлена схема `CancelRequest` (reason: Optional[str], max_length=500)
- Удалён дублёр `backend/app/api/injections.py`

### Frontend (воркер 2)
**Исправлена цветовая палитра Tailwind:**
- Ключ `sekov` → `usnee` в `tailwind.config.js`
- Все hex-значения сохранены: 900='#0f0c29', 500='#7c3aed', 400='#a855f7' и т.д.
- Проверена корректность всех custom CSS классов (`glass`, `text-gradient`, `btn-primary`)
- API client путь `/injections/{id}/cancel` совпадает с backend endpoint

### Bot & Docker (воркер 3)
**Исправлены импорты бота:**
- `sys.path.append('/app')` в `bot/main.py` для корректного импорта `app.core.config`
- `ENV PYTHONPATH=/app` в `Dockerfile.bot`
- Синхронизированы env-переменные `ENCRYPTION_KEY` и `SECRET_KEY` между backend и bot в `docker-compose.yml`
- Добавлен `SECRET_KEY` в `.env.example`

---

## 16. Активные задачи (TODO)

### Сейчас (в процессе)
- [ ] E2E тестирование (Bot → Backend → Frontend)
- [ ] Deploy на staging
- [ ] Mini App конфигурация в BotFather

### Скоро
- [ ] Дополнить `.env` (заменить `sekov` на `usnee` в `DATABASE_URL` примере)
- [ ] Глобальная замена `SEKSOV` → `USNEE` в исходном коде (main.py заголовок, package.json name и т.д.)

### Позже (Post-MVP)
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Bundle size monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics integration
- [ ] Балансировка XP/ачивок через аналитику

---

## 17. Критические замечания (актуальные)

### ⚠️ .env файл — остатки старого имени
В `.env.example` строка 6: `DATABASE_URL=postgresql+asyncpg://sekov:...` — имя пользователя и БД `sekov`, должно быть `usnee`. Не критично для dev, но запутывает при первом запуске.

### ⚠️ Имя проекта в коде (остатки)
Некоторые файлы всё ещё содержат `SEKSOV`:
- `backend/app/main.py` — заголовок "USNEE API" уже обновлён, но комментарии могут содержать старое имя
- `frontend/index.html` — `<title>` ещё не проверен
- `frontend/package.json` — `"name": "usnee-frontend"` уже обновлено
- `frontend/src/stores/appStore.ts` — persist key `'sekov-app-storage'` ещё не проверен

**Рекомендация:** глобальный поиск по `sekov`/`SEKSOV` в коде перед production deploy.

---

## 18. Ссылки и ресурсы

- **Repository:** https://github.com/AdamFolz/SEKSOV-
- **API Docs:** `http://localhost:8000/docs` (FastAPI Swagger UI)
- **Дизайн:** `usnee_design_v2.png` — Dashboard + History (glassmorphism, purple gradient)
- **Legacy документация:** `SEKSOV_GAMIFICATION_PLAN.md`
