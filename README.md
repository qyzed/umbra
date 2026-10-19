# UMBRA — анонимные сообщения в Telegram

Проект создан [Rin](https://t.me/Rinbland).

Монорепозиторий из двух частей:

- **`bot/`** — Telegram-бот на Python 3.10+ / aiogram 3.x / SQLite.
  Deep links, inline-клавиатуры без эмодзи, медиавложения,
  персональные бан-листы, анонимные ответы.
- **`src/`** — сайт на Next.js: лендинг в тёмной эстетике,
  Telegram Mini App (`/app`), исходный код бота (`/code`)
  и инструкция по бесплатному деплою (`/deploy`).

## Быстрый старт

```bash
# Бот
cd bot
pip install -r requirements.txt
cp .env.example .env   # впишите BOT_TOKEN
python main.py

# Сайт
npm install
npm run dev
```

## Безопасность

Токен бота передаётся только через переменные окружения (`BOT_TOKEN`)
и никогда не коммитится в Git: `.env`, `umbra.db` и кэши — в `.gitignore`.
