FROM node:20-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm ci

# Копирование кода
COPY . .

# Сборка (API будет доступен через /api прокси)
RUN npm run build

# Production stage
FROM nginx:alpine

# Копируем собранный frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx конфиг с проксированием API
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    # Frontend static \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
        add_header Cache-Control "no-cache"; \
    } \
    \
    # Backend API proxy \
    location /api/ { \
        proxy_pass http://backend:8000/api/; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    \
    # Health check \
    location /health { \
        proxy_pass http://backend:8000/health; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
