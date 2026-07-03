# 🚀 Быстрый деплой USNEE — 5 минут

> Разворачиваем backend на Railway + frontend на Vercel. Уже всё настроено в коде.

---

## ✅ Что уже сделано

- [x] Код запушен на GitHub
- [x] `railway.json` — настроен Docker build для Railway
- [x] `Dockerfile.railway` — собирает backend
- [x] `vercel.json` — настроен Vite build для Vercel
- [x] Backend: dev-режим, SQLite fallback, CORS localhost
- [x] Frontend: прокси на `/api` для dev

---

## Шаг 1. Railway (Backend + PostgreSQL) — 3 минуты

1. Открой https://railway.app и войди через GitHub
2. **New Project** → **Deploy from GitHub repo** → выбери `usnee`
3. **New** → **Database** → **Add PostgreSQL** (создаётся автоматически)
4. Перейди в сервис `usnee` → **Variables** → **New Variable**:
   - `BOT_TOKEN` = `dev_token` (или реальный от @BotFather)
   - `WEBAPP_URL` = `https://usnee-frontend.vercel.app` (пока placeholder, обновим позже)
   - `WEBHOOK_URL` = URL Railway (пока placeholder)
   - `ENCRYPTION_KEY` = `dev_encryption_key_123456789012345678901234567890`
   - `SECRET_KEY` = `dev_secret_key_123456789012345678901234567890`
   - `CORS_ORIGINS` = `["https://*.telegram.org","https://usnee-frontend.vercel.app"]`
5. Railway сам найдёт `DATABASE_URL` от PostgreSQL и подключит
6. Дождись зелёного статуса → скопируй URL (например `https://usnee.up.railway.app`)

---

## Шаг 2. Vercel (Frontend) — 2 минуты

1. Открой https://vercel.com и войди через GitHub
2. **Add New Project** → **Import** → выбери `usnee`
3. **Root Directory**: `usnee-frontend` ⬅️ важно!
4. Framework Preset: **Vite** (должен определиться автоматически)
5. **Environment Variables** → добавь:
   - `VITE_API_URL` = `https://usnee.up.railway.app/api` (URL Railway + `/api`)
6. **Deploy**
7. Скопируй URL (например `https://usnee-frontend.vercel.app`)

---

## Шаг 3. Обновить Railway (1 минута)

1. В Railway → Variables → `WEBAPP_URL`
2. Установи значение: `https://usnee-frontend.vercel.app`
3. Railway автоматически перезапустит backend

---

## Шаг 4. Проверка (30 секунд)

```bash
# Проверь API
curl https://usnee.up.railway.app/health
# → {"status": "ok", "version": "2.0.0"}
```

Открой frontend URL — приложение должно работать.

---

## 💰 Стоимость для 1-2 человек

| Сервис | Стоимость |
|--------|-----------|
| Railway | **$0** (бесплатные кредиты $5/мес хватит на 2-3 месяца) |
| Vercel | **$0** (бесплатно для static sites) |
| PostgreSQL (Railway) | **$0** (500 MB included) |

---

## 🔄 Обновление кода

```bash
git add -A
git commit -m "Fix something"
git push origin main
```

- Railway пересоберёт backend автоматически
- Vercel пересоберёт frontend автоматически

---

## 🆘 Если что-то не работает

### Railway: "Failed to deploy"
- Railway → сервис → **Logs** — смотри ошибки
- Убедись, что `DATABASE_URL` содержит `asyncpg` (Railway генерирует `postgresql://`, замени на `postgresql+asyncpg://` в Variables если нужно)

### Frontend: белый экран
- Проверь `VITE_API_URL` — должен заканчиваться на `/api`
- Проверь `CORS_ORIGINS` в Railway — должен включать Vercel URL

### Бот не отвечает
- Для теста без Telegram: используй dev-режим (`X-Test-User-Id` header)
- Для реального бота: замени `BOT_TOKEN` на настоящий от @BotFather

---

**Готово! Теперь приложение работает 24/7 и доступно по ссылке.**
