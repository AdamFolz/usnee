# 🚀 Деплой USNEE в облако (Railway + Vercel)

> Для тех, у кого нет Docker и хочется, чтобы бот работал 24/7 без вашего ПК.

---

## Что мы получим

| Компонент | Сервис | Стоимость | Автономность |
|-----------|--------|-----------|--------------|
| **Backend API + Бот** | Railway | $5/мес (бесплатные кредиты на старт) | ✅ 24/7 |
| **Mini App (Frontend)** | Vercel | Бесплатно | ✅ 24/7 |
| **PostgreSQL БД** | Railway | Бесплатно (500 MB) | ✅ 24/7 |

---

## Что нужно подготовить

1. **Аккаунт GitHub** — репозиторий с кодом проекта
2. **Аккаунт Railway** — https://railway.app (заход через GitHub)
3. **Аккаунт Vercel** — https://vercel.com (заход через GitHub)
4. **Телеграм бот** — создан через @BotFather

---

## Шаг 1. Создать Telegram бота

1. Напишите @BotFather в Telegram
2. Отправьте `/newbot`
3. Укажите имя (USNEE) и username (usnee_bot)
4. **Сохраните токен** — он понадобится далее
5. Отправьте `/mybots` → выберите бота → Bot Settings → Menu Button
6. Нажмите **Configure menu button** → **Menu button URL**
7. Вставьте URL Mini App (получим на Шаге 4, пока оставьте пустым)

---

## Шаг 2. Загрузить код на GitHub

```bash
# Если ещё не инициализирован git
cd M:\SEKS\АКТУАЛЬНОЕ\USNEE
git init
git add -A
git commit -m "Initial USNEE deploy"

# Создать репозиторий на GitHub и привязать
git remote add origin https://github.com/ВАШ_НИК/usnee.git
git push -u origin main
```

---

## Шаг 3. Деплой Backend на Railway

### 3.1 Создать проект
1. Откройте https://railway.app
2. Нажмите **New Project** → **Deploy from GitHub repo**
3. Выберите ваш репозиторий `usnee`

### 3.2 Добавить PostgreSQL
1. В проекте нажмите **New** → **Database** → **Add PostgreSQL**
2. Railway создаст БД автоматически

### 3.3 Настроить переменные окружения
1. Перейдите в сервис backend → **Variables** → **New Variable**
2. Добавьте все переменные:

| Переменная | Значение | Пример |
|------------|----------|--------|
| `BOT_TOKEN` | Токен от @BotFather | `123456:ABC-DEF...` |
| `DATABASE_URL` | Railway предоставит автоматически | `postgresql+asyncpg://...` |
| `WEBAPP_URL` | URL Mini App (см. Шаг 4) | `https://usnee.vercel.app/` |
| `WEBHOOK_URL` | URL Railway backend (без `/api`) | `https://usnee-api.up.railway.app` |
| `ENCRYPTION_KEY` | Сгенерировать | `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `SECRET_KEY` | Сгенерировать | `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `CORS_ORIGINS` | Разрешённые домены | `["https://*.telegram.org", "https://usnee.vercel.app"]` |

3. Railway автоматически сгенерирует `DATABASE_URL` для PostgreSQL

### 3.4 Запустить деплой
1. Railway автоматически деплоит при каждом `git push`
2. Дождитесь зелёного статуса **Deploy** → **Live**
3. Скопируйте URL сервиса (например, `https://usnee-api.up.railway.app`)

---

## Шаг 4. Деплой Frontend на Vercel

### 4.1 Создать проект
1. Откройте https://vercel.com
2. Нажмите **Add New Project** → **Import Git Repository**
3. Выберите `usnee`
4. В **Root Directory** укажите `usnee-frontend`
5. Framework Preset: **Vite**

### 4.2 Настроить переменные окружения
1. В настройках проекта → **Environment Variables**
2. Добавьте:
   - `VITE_API_URL` = URL Railway backend + `/api` (например: `https://usnee-api.up.railway.app/api`)

### 4.3 Запустить деплой
1. Нажмите **Deploy**
2. Дождитесь зелёного статуса
3. Скопируйте URL (например, `https://usnee.vercel.app`)

### 4.4 Вернуться в Railway и обновить WEBAPP_URL
1. В Railway → Variables → `WEBAPP_URL`
2. Установите значение: `https://usnee.vercel.app/` (URL из Vercel)
3. Railway автоматически перезапустит backend

### 4.5 Настроить Mini App в @BotFather
1. Вернитесь к @BotFather
2. Отправьте `/mybots` → выберите USNEE → Bot Settings → Menu Button
3. **Configure menu button** → **Menu button URL**
4. Вставьте: `https://usnee.vercel.app/`

---

## Шаг 5. Проверка работы

### Проверить API
```bash
curl https://usnee-api.up.railway.app/health
# Должно вернуть: {"status": "ok", "version": "2.0.0"}
```

### Проверить бота
1. Найдите своего бота в Telegram (например, @usnee_bot)
2. Отправьте `/start`
3. Должно появиться сообщение с кнопкой **"Открыть USNEE"**
4. Нажмите кнопку — откроется Mini App

### Проверить запись инъекции
1. В Mini App выберите триггер, способ, место, объём
2. Нажмите **Записать**
3. Должно появиться подтверждение с ироничным сообщением

---

## Шаг 6. Пригласить друга

Просто отправьте ему ссылку на бота (например, `https://t.me/usnee_bot`).
Он нажмёт **Start**, затем **Открыть USNEE** — и всё работает.

Каждый пользователь видит только свои данные (изоляция через Telegram ID).

---

## 💰 Стоимость

| Сервис | Бесплатный лимит | Реальная стоимость |
|--------|-----------------|-------------------|
| Railway | $5 кредитов/мес | $5-10/мес для MVP |
| Vercel | Безлимитно для frontend | $0 |
| PostgreSQL (Railway) | 500 MB | $0 для старта |

Для 2-10 пользователей бесплатных кредитов Railway хватит на несколько месяцев. Если пользователей больше — $5-10/мес.

---

## 🔧 Обновление кода

```bash
# Внесите изменения в код
git add -A
git commit -m "Fix something"
git push origin main
```

- **Railway** автоматически пересоберёт backend
- **Vercel** автоматически пересоберёт frontend

---

## 🆘 Если что-то не работает

### Railway: "Failed to deploy"
- Проверьте логи: Railway → сервис → **Logs**
- Убедитесь, что все переменные окружения заданы
- Проверьте, что `DATABASE_URL` содержит `asyncpg` (Railway генерирует обычный URL, нужно добавить `+asyncpg`)

### Telegram: бот не отвечает
- Проверьте, что `BOT_TOKEN` корректный
- Проверьте логи Railway на ошибки webhook
- Убедитесь, что `WEBAPP_URL` начинается с `https://` (не http)

### Mini App: белый экран
- Проверьте URL в Vercel (должен быть `https://`)
- Проверьте `CORS_ORIGINS` в Railway — должен включать ваш Vercel URL
- Откройте DevTools в Telegram WebView и проверьте ошибки

---

## 📁 Файлы, созданные для деплоя

| Файл | Назначение |
|------|-----------|
| `railway.json` | Конфигурация Railway (Docker build + deploy) |
| `usnee-frontend/vercel.json` | Конфигурация Vercel (Vite build) |
| `backend/app/telegram_webhook.py` | Webhook endpoint для Telegram бота |
| `backend/app/main.py` | Подключение webhook + shutdown |

---

**Готово! Ваш бот теперь работает 24/7 в облаке. 🎉**
