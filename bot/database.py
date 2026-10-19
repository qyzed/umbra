"""Слой данных UMBRA: SQLite через aiosqlite.

Хранит пользователей, анонимные сообщения и персональные бан-листы.
ID отправителя сохраняется технически (для банов), но никогда
не показывается получателю.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import aiosqlite

from config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    tg_id         INTEGER PRIMARY KEY,
    username      TEXT,
    full_name     TEXT,
    notifications INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id    INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    kind         TEXT NOT NULL,          -- text | photo | video | sticker
    body         TEXT,                   -- текст или подпись к медиа
    file_id      TEXT,                   -- Telegram file_id для медиа
    is_read      INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bans (
    owner_id   INTEGER NOT NULL,
    blocked_id INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (owner_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages (recipient_id, id DESC);
"""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


async def init_db() -> None:
    async with aiosqlite.connect(settings.db_path) as db:
        await db.executescript(SCHEMA)
        await db.commit()


async def upsert_user(tg_id: int, username: str | None, full_name: str | None) -> None:
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute(
            """
            INSERT INTO users (tg_id, username, full_name, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(tg_id) DO UPDATE SET username = excluded.username,
                                             full_name = excluded.full_name
            """,
            (tg_id, username, full_name, _now()),
        )
        await db.commit()


async def get_user(tg_id: int) -> dict[str, Any] | None:
    async with aiosqlite.connect(settings.db_path) as db:
        db.row_factory = aiosqlite.Row
        cur = await db.execute("SELECT * FROM users WHERE tg_id = ?", (tg_id,))
        row = await cur.fetchone()
        return dict(row) if row else None


async def add_message(
    sender_id: int,
    recipient_id: int,
    kind: str,
    body: str | None = None,
    file_id: str | None = None,
) -> int:
    async with aiosqlite.connect(settings.db_path) as db:
        cur = await db.execute(
            """
            INSERT INTO messages (sender_id, recipient_id, kind, body, file_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (sender_id, recipient_id, kind, body, file_id, _now()),
        )
        await db.commit()
        return int(cur.lastrowid or 0)


async def get_inbox(recipient_id: int, limit: int = 5, offset: int = 0) -> list[dict[str, Any]]:
    async with aiosqlite.connect(settings.db_path) as db:
        db.row_factory = aiosqlite.Row
        cur = await db.execute(
            """
            SELECT * FROM messages
            WHERE recipient_id = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            """,
            (recipient_id, limit, offset),
        )
        return [dict(r) for r in await cur.fetchall()]


async def count_inbox(recipient_id: int) -> int:
    async with aiosqlite.connect(settings.db_path) as db:
        cur = await db.execute(
            "SELECT COUNT(*) FROM messages WHERE recipient_id = ?", (recipient_id,)
        )
        (count,) = await cur.fetchone()
        return int(count)


async def get_message(message_id: int) -> dict[str, Any] | None:
    async with aiosqlite.connect(settings.db_path) as db:
        db.row_factory = aiosqlite.Row
        cur = await db.execute("SELECT * FROM messages WHERE id = ?", (message_id,))
        row = await cur.fetchone()
        return dict(row) if row else None


async def mark_read(message_id: int) -> None:
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute("UPDATE messages SET is_read = 1 WHERE id = ?", (message_id,))
        await db.commit()


async def toggle_notifications(tg_id: int) -> bool:
    """Переключает уведомления, возвращает новое состояние (True = включены)."""
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute(
            "UPDATE users SET notifications = 1 - notifications WHERE tg_id = ?", (tg_id,)
        )
        await db.commit()
        cur = await db.execute("SELECT notifications FROM users WHERE tg_id = ?", (tg_id,))
        row = await cur.fetchone()
        return bool(row and row[0])


async def ban_user(owner_id: int, blocked_id: int) -> None:
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute(
            "INSERT OR IGNORE INTO bans (owner_id, blocked_id, created_at) VALUES (?, ?, ?)",
            (owner_id, blocked_id, _now()),
        )
        await db.commit()


async def is_banned(owner_id: int, blocked_id: int) -> bool:
    async with aiosqlite.connect(settings.db_path) as db:
        cur = await db.execute(
            "SELECT 1 FROM bans WHERE owner_id = ? AND blocked_id = ?",
            (owner_id, blocked_id),
        )
        return await cur.fetchone() is not None


async def delete_user_data(tg_id: int) -> None:
    """Полное удаление данных пользователя (GDPR-style)."""
    async with aiosqlite.connect(settings.db_path) as db:
        await db.execute(
            "DELETE FROM messages WHERE sender_id = ? OR recipient_id = ?", (tg_id, tg_id)
        )
        await db.execute(
            "DELETE FROM bans WHERE owner_id = ? OR blocked_id = ?", (tg_id, tg_id)
        )
        await db.execute("DELETE FROM users WHERE tg_id = ?", (tg_id,))
        await db.commit()


async def stats_summary(tg_id: int) -> dict[str, int]:
    async with aiosqlite.connect(settings.db_path) as db:
        cur = await db.execute(
            "SELECT COUNT(*) FROM messages WHERE recipient_id = ?", (tg_id,)
        )
        (total,) = await cur.fetchone()
        cur = await db.execute(
            "SELECT COUNT(*) FROM messages WHERE recipient_id = ? AND is_read = 0", (tg_id,)
        )
        (unread,) = await cur.fetchone()
        cur = await db.execute("SELECT COUNT(*) FROM bans WHERE owner_id = ?", (tg_id,))
        (bans,) = await cur.fetchone()
        return {"total": int(total), "unread": int(unread), "bans": int(bans)}
