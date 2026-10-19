# UMBRA — бот для анонимных сообщений

Проект создан [Rin](https://t.me/Rinbland).

Тёмен, строг, безмолвен. Код без эмодзи, токен — только в `.env`.

## Стек

- Python 3.10+
- aiogram 3.x — асинхронный фреймворк Telegram Bot API
- SQLite через aiosqlite — база без внешних зависимостей

## Локальный запуск

```bash
cd bot
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # впишите BOT_TOKEN от @BotFather
python main.py
```

## Структура

| Файл           | Назначение                                            |
| -------------- | ----------------------------------------------------- |
| `main.py`      | Роутеры, deep linking, доставка медиа, баны, ответы   |
| `keyboards.py` | Inline-клавиатуры (текстовые метки, без эмодзи)       |
| `database.py`  | SQLite: пользователи, сообщения, бан-листы            |
| `config.py`    | Чтение переменных окружения                           |
| `states.py`    | FSM-состояния: отправка и анонимный ответ             |

## Переменные окружения

См. `.env.example`. Обязательная — только `BOT_TOKEN`.
Никогда не коммитьте `.env` в Git (он уже в `.gitignore`).

## Деплой

Пошаговые инструкции по бесплатным хостингам (Render, Railway, Fly.io,
PythonAnywhere) — на странице **«Деплой»** сайта (`/deploy`).
