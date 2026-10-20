"""Конфигурация UMBRA. Все секреты читаются только из переменных окружения."""

from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    bot_token: str
    bot_username: str
    creator_name: str
    creator_url: str
    db_path: str


def get_settings() -> Settings:
    token = os.getenv("BOT_TOKEN", "").strip()
    if not token:
        raise RuntimeError(
            "Переменная окружения BOT_TOKEN не задана. "
            "Скопируйте .env.example в .env и впишите токен от @BotFather."
        )
    username = os.getenv("BOT_USERNAME", "anononsad_bot").strip().lstrip("@")
    return Settings(
        bot_token=token,
        bot_username=username or "anononsad_bot",
        creator_name=os.getenv("CREATOR_NAME", "Rin"),
        creator_url=os.getenv("CREATOR_URL", "https://t.me/Rinbland"),
        db_path=os.getenv("DB_PATH", "umbra.db"),
    )


settings = get_settings()
