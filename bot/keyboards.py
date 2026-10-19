"""Inline-клавиатуры UMBRA.

Только текстовые метки и Unicode-символы («←», «→», «‹ ›», «•»).
Эмодзи намеренно не используются.
"""

from __future__ import annotations

from urllib.parse import quote

from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

from config import settings

SHARE_TEXT = "Привет. Оставь мне анонимное сообщение — я не узнаю, кто ты."


def personal_link(user_id: int) -> str:
    return f"https://t.me/{settings.bot_username}?start={user_id}"


def _share_url(link: str) -> str:
    return f"https://t.me/share/url?url={quote(link)}&text={quote(SHARE_TEXT)}"


def main_menu() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="Моя ссылка →", callback_data="menu:link")
    kb.button(text="Мои сообщения", callback_data="menu:inbox:0")
    kb.button(text="Настройки", callback_data="menu:settings")
    kb.button(text="О создателе", callback_data="menu:about")
    kb.adjust(1)
    return kb.as_markup()


def link_menu(user_id: int) -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="Поделиться ссылкой →", url=_share_url(personal_link(user_id)))
    kb.button(text="← В меню", callback_data="menu:main")
    kb.adjust(1)
    return kb.as_markup()


def after_send(recipient_id: int) -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="Отправить ещё →", callback_data=f"send:more:{recipient_id}")
    kb.button(text="Создать свою ссылку", url=f"https://t.me/{settings.bot_username}")
    kb.adjust(1)
    return kb.as_markup()


def inbox_list(
    messages: list[dict], offset: int, total: int, page_size: int
) -> InlineKeyboardMarkup:
    rows: list[list[InlineKeyboardButton]] = []
    for msg in messages:
        preview = (msg.get("body") or "").strip().replace("\n", " ")
        if not preview:
            preview = {"photo": "Фото", "video": "Видео", "sticker": "Стикер"}.get(
                msg.get("kind"), "Сообщение"
            )
        preview = preview[:24] + ("…" if len(preview) > 24 else "")
        unread = "•  " if not msg.get("is_read") else ""
        rows.append(
            [
                InlineKeyboardButton(
                    text=f"{unread}№{msg['id']} · {preview}",
                    callback_data=f"msg:open:{msg['id']}:{offset}",
                )
            ]
        )

    nav_row: list[InlineKeyboardButton] = []
    if offset > 0:
        nav_row.append(
            InlineKeyboardButton(
                text="‹ Назад", callback_data=f"menu:inbox:{max(offset - page_size, 0)}"
            )
        )
    if offset + page_size < total:
        nav_row.append(
            InlineKeyboardButton(text="Вперёд ›", callback_data=f"menu:inbox:{offset + page_size}")
        )
    if nav_row:
        rows.append(nav_row)

    rows.append([InlineKeyboardButton(text="← В меню", callback_data="menu:main")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def message_actions(message_id: int) -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="Ответить", callback_data=f"msg:reply:{message_id}")
    kb.button(text="Заблокировать отправителя", callback_data=f"msg:ban:{message_id}")
    kb.button(text="← В меню", callback_data="menu:main")
    kb.adjust(1)
    return kb.as_markup()


def message_actions_open(message_id: int, offset: int) -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="Ответить", callback_data=f"msg:reply:{message_id}")
    kb.button(text="Заблокировать отправителя", callback_data=f"msg:ban:{message_id}")
    kb.button(text="← К списку", callback_data=f"menu:inbox:{offset}")
    kb.adjust(1)
    return kb.as_markup()


def cancel_writing() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="Отмена", callback_data="fsm:cancel")
    return kb.as_markup()


def settings_menu(notifications: bool) -> InlineKeyboardMarkup:
    state = "вкл" if notifications else "выкл"
    kb = InlineKeyboardBuilder()
    kb.button(text=f"Уведомления: {state}", callback_data="set:notify")
    kb.button(text="Удалить мои данные", callback_data="set:purge")
    kb.button(text="← В меню", callback_data="menu:main")
    kb.adjust(1)
    return kb.as_markup()


def purge_confirm() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(text="Да, удалить всё", callback_data="set:purge:yes")
    kb.button(text="Отмена", callback_data="menu:settings")
    kb.adjust(1)
    return kb.as_markup()


def about_menu() -> InlineKeyboardMarkup:
    kb = InlineKeyboardBuilder()
    kb.button(
        text=f"Написать {settings.creator_name} →",
        url=settings.creator_url,
    )
    kb.button(text="← В меню", callback_data="menu:main")
    kb.adjust(1)
    return kb.as_markup()
