"""UMBRA — бот для анонимных сообщений в Telegram.

Проект создан Rin: https://t.me/Rinbland

Стек: aiogram 3.x + SQLite (aiosqlite).
Токен читается только из переменной окружения BOT_TOKEN (см. config.py).
"""

from __future__ import annotations

import asyncio
import logging
from html import escape

from aiogram import Bot, Dispatcher, F, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ContentType, ParseMode
from aiogram.exceptions import TelegramBadRequest, TelegramForbiddenError
from aiogram.filters import Command, CommandObject, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import BotCommand, CallbackQuery, Message

import database as db
import keyboards as kb
from config import settings
from states import ReplyAnon, SendAnon

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s · %(levelname)s · %(name)s · %(message)s",
)
log = logging.getLogger("umbra")

router = Router()
PAGE_SIZE = 5

MEDIA_ALLOWED = {
    ContentType.TEXT,
    ContentType.PHOTO,
    ContentType.VIDEO,
    ContentType.STICKER,
}


# ————————————————————————— Тексты —————————————————————————


def text_welcome(user_id: int) -> str:
    link = kb.personal_link(user_id)
    return (
        "<b>UMBRA · анонимные сообщения</b>\n\n"
        "Ваша персональная ссылка готова:\n"
        f"<code>{link}</code>\n\n"
        "Отправьте её друзьям или выложите в сторис — "
        "они смогут написать вам, не раскрывая себя.\n\n"
        f"<i>Проект создан <a href=\"{settings.creator_url}\">"
        f"{settings.creator_name}</a></i>"
    )


def text_link(user_id: int) -> str:
    link = kb.personal_link(user_id)
    return (
        "<b>Моя ссылка</b>\n\n"
        f"<code>{link}</code>\n\n"
        "Нажмите «Поделиться ссылкой», чтобы отправить её в любой чат "
        "или соцсеть."
    )


def text_about() -> str:
    return (
        "<b>О проекте</b>\n\n"
        "UMBRA — минималистичный бот для анонимных сообщений: "
        "одна ссылка, ноль раскрытых личностей.\n\n"
        "• Анонимность отправителя гарантирована\n"
        "• Текст, фото, видео и стикеры\n"
        "• Персональные бан-листы и анонимные ответы\n\n"
        f"Проект создан <a href=\"{settings.creator_url}\">"
        f"<b>{settings.creator_name}</b></a>."
    )


def text_settings(notifications: bool, stats: dict[str, int]) -> str:
    state = "включены" if notifications else "выключены"
    return (
        "<b>Настройки</b>\n\n"
        f"• Уведомления сейчас <b>{state}</b>\n"
        f"• Входящих всего: <b>{stats['total']}</b> "
        f"(непрочитанных — {stats['unread']})\n"
        f"• В бан-листе: <b>{stats['bans']}</b>\n\n"
        "Удаление данных стирает вашу ссылку, сообщения и бан-лист "
        "без возможности восстановления."
    )


# ————————————————————————— Команды —————————————————————————


async def register(message: Message) -> None:
    user = message.from_user
    if user:
        await db.upsert_user(user.id, user.username, user.full_name)


@router.message(CommandStart(deep_link=True))
async def on_start_deeplink(
    message: Message, command: CommandObject, state: FSMContext
) -> None:
    await state.clear()
    await register(message)
    arg = (command.args or "").strip()
    sender_id = message.from_user.id

    if not arg.isdigit():
        await message.answer(
            "<b>Ссылка повреждена.</b>\nПопросите у владельца корректную "
            "персональную ссылку — или создайте свою.",
            reply_markup=kb.main_menu(),
        )
        return

    recipient_id = int(arg)

    if recipient_id == sender_id:
        await message.answer(
            "<b>Это ваша собственная ссылка.</b>\n"
            "Отправлять анонимные сообщения самому себе нельзя — "
            "поделитесь ею с кем-нибудь ещё.",
            reply_markup=kb.link_menu(sender_id),
        )
        return

    recipient = await db.get_user(recipient_id)
    if recipient is None:
        await message.answer(
            "<b>Пользователь недоступен.</b>\n"
            "Владелец этой ссылки ещё не запускал бота.",
            reply_markup=kb.main_menu(),
        )
        return

    await state.set_state(SendAnon.writing)
    await state.update_data(recipient_id=recipient_id)
    await message.answer(
        "<b>Вы пишете анонимное сообщение</b>\n\n"
        "Отправьте текст, фото, видео или стикер — "
        "ваше имя останется в секрете.",
        reply_markup=kb.cancel_writing(),
    )


@router.message(CommandStart())
async def on_start(message: Message, state: FSMContext) -> None:
    await state.clear()
    await register(message)
    await message.answer(
        text_welcome(message.from_user.id),
        reply_markup=kb.main_menu(),
        disable_web_page_preview=True,
    )


@router.message(Command("link"))
async def on_link_command(message: Message, state: FSMContext) -> None:
    await state.clear()
    await register(message)
    await message.answer(
        text_link(message.from_user.id),
        reply_markup=kb.link_menu(message.from_user.id),
        disable_web_page_preview=True,
    )


@router.message(Command("inbox"))
async def on_inbox_command(message: Message, state: FSMContext) -> None:
    await state.clear()
    await register(message)
    await render_inbox(message.from_user.id, 0, target=message)


@router.message(Command("about"))
async def on_about_command(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer(
        text_about(), reply_markup=kb.about_menu(), disable_web_page_preview=True
    )


# ————————————————————————— Меню (callback) —————————————————————————


async def safe_edit(call: CallbackQuery, text: str, markup) -> None:
    try:
        await call.message.edit_text(text, reply_markup=markup, disable_web_page_preview=True)
    except TelegramBadRequest:
        await call.message.answer(text, reply_markup=markup, disable_web_page_preview=True)


@router.callback_query(F.data == "menu:main")
async def on_menu_main(call: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await safe_edit(call, text_welcome(call.from_user.id), kb.main_menu())
    await call.answer()


@router.callback_query(F.data == "menu:link")
async def on_menu_link(call: CallbackQuery) -> None:
    await safe_edit(call, text_link(call.from_user.id), kb.link_menu(call.from_user.id))
    await call.answer()


@router.callback_query(F.data == "menu:about")
async def on_menu_about(call: CallbackQuery) -> None:
    await safe_edit(call, text_about(), kb.about_menu())
    await call.answer()


@router.callback_query(F.data == "menu:settings")
async def on_menu_settings(call: CallbackQuery) -> None:
    user = await db.get_user(call.from_user.id)
    notifications = bool(user and user.get("notifications", 1))
    stats = await db.stats_summary(call.from_user.id)
    await safe_edit(call, text_settings(notifications, stats), kb.settings_menu(notifications))
    await call.answer()


async def render_inbox(user_id: int, offset: int, target: Message | CallbackQuery) -> None:
    total = await db.count_inbox(user_id)
    messages = await db.get_inbox(user_id, PAGE_SIZE, offset)

    if total == 0:
        text = (
            "<b>Мои сообщения</b>\n\n"
            "Пока пусто. Поделитесь вашей ссылкой — и первые "
            "анонимные сообщения не заставят себя ждать."
        )
        markup = kb.link_menu(user_id)
    else:
        text = (
            f"<b>Мои сообщения</b> · всего {total}\n\n"
            "Точкой отмечены непрочитанные. Откройте сообщение, "
            "чтобы ответить или заблокировать отправителя."
        )
        markup = kb.inbox_list(messages, offset, total, PAGE_SIZE)

    if isinstance(target, CallbackQuery):
        await safe_edit(target, text, markup)
        await target.answer()
    else:
        await target.answer(text, reply_markup=markup, disable_web_page_preview=True)


@router.callback_query(F.data.regexp(r"^menu:inbox:\d+$"))
async def on_menu_inbox(call: CallbackQuery) -> None:
    offset = int(call.data.rsplit(":", 1)[1])
    await render_inbox(call.from_user.id, offset, target=call)


# ——————————————————— Карточка сообщения, бан, ответ ———————————————————


@router.callback_query(F.data.regexp(r"^msg:open:\d+:\d+$"))
async def on_open_message(call: CallbackQuery) -> None:
    _, _, message_id_s, offset_s = call.data.split(":")
    message_id, offset = int(message_id_s), int(offset_s)
    msg = await db.get_message(message_id)

    if not msg or msg["recipient_id"] != call.from_user.id:
        await call.answer("Сообщение недоступно", show_alert=True)
        return

    await db.mark_read(message_id)
    body = (msg.get("body") or "").strip()
    kind_label = {"photo": "Фото", "video": "Видео", "sticker": "Стикер"}.get(
        msg["kind"], None
    )

    text = f"<b>Анонимное сообщение №{message_id}</b>\n\n"
    if body:
        text += f"<blockquote>{escape(body)}</blockquote>\n"
    if kind_label:
        text += f"<i>Вложение: {kind_label} (идентификатор скрыт)</i>\n"
    text += "\n<i>Личность отправителя неизвестна.</i>"

    await safe_edit(call, text, kb.message_actions_open(message_id, offset))
    await call.answer()


@router.callback_query(F.data.regexp(r"^msg:ban:\d+$"))
async def on_ban_sender(call: CallbackQuery) -> None:
    message_id = int(call.data.rsplit(":", 1)[1])
    msg = await db.get_message(message_id)

    if not msg or msg["recipient_id"] != call.from_user.id:
        await call.answer("Сообщение недоступно", show_alert=True)
        return

    await db.ban_user(call.from_user.id, msg["sender_id"])
    await safe_edit(
        call,
        "<b>Отправитель заблокирован.</b>\n\n"
        "ID внесён в ваш бан-лист — этот человек больше не сможет "
        "писать вам. Вы по-прежнему не знаете, кто это был.",
        kb.main_menu(),
    )
    await call.answer("Отправитель заблокирован")


@router.callback_query(F.data.regexp(r"^msg:reply:\d+$"))
async def on_reply_start(call: CallbackQuery, state: FSMContext) -> None:
    message_id = int(call.data.rsplit(":", 1)[1])
    msg = await db.get_message(message_id)

    if not msg or msg["recipient_id"] != call.from_user.id:
        await call.answer("Сообщение недоступно", show_alert=True)
        return

    await state.set_state(ReplyAnon.writing)
    await state.update_data(reply_message_id=message_id)
    await call.message.answer(
        "<b>Ваш ответ</b>\n\n"
        "Напишите текст — автор получит его как ответ владельца ссылки, "
        "ваша личность останется скрытой.",
        reply_markup=kb.cancel_writing(),
    )
    await call.answer()


@router.callback_query(F.data == "fsm:cancel")
async def on_fsm_cancel(call: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await safe_edit(call, "Действие отменено.", kb.main_menu())
    await call.answer()


# ————————————————————————— Настройки —————————————————————————


@router.callback_query(F.data == "set:notify")
async def on_toggle_notify(call: CallbackQuery) -> None:
    enabled = await db.toggle_notifications(call.from_user.id)
    stats = await db.stats_summary(call.from_user.id)
    await safe_edit(call, text_settings(enabled, stats), kb.settings_menu(enabled))
    await call.answer("Уведомления включены" if enabled else "Уведомления выключены")


@router.callback_query(F.data == "set:purge")
async def on_purge_confirm(call: CallbackQuery) -> None:
    await safe_edit(
        call,
        "<b>Удалить все данные?</b>\n\n"
        "Будут стёрты: ваша ссылка, входящие и отправленные сообщения, "
        "бан-лист. Действие необратимо.",
        kb.purge_confirm(),
    )
    await call.answer()


@router.callback_query(F.data == "set:purge:yes")
async def on_purge_execute(call: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await db.delete_user_data(call.from_user.id)
    await safe_edit(
        call,
        "<b>Данные удалены.</b>\n\n"
        "Ссылка, сообщения и бан-лист стёрты. "
        "Вернётесь — отправьте /start, и бот создаст новую ссылку.",
        kb.main_menu(),
    )
    await call.answer("Данные удалены")


# ——————————————————— Отправка анонимного сообщения ———————————————————


@router.callback_query(F.data.regexp(r"^send:more:\d+$"))
async def on_send_more(call: CallbackQuery, state: FSMContext) -> None:
    recipient_id = int(call.data.rsplit(":", 1)[1])
    if recipient_id == call.from_user.id:
        await call.answer("Самому себе писать нельзя", show_alert=True)
        return
    await state.set_state(SendAnon.writing)
    await state.update_data(recipient_id=recipient_id)
    await call.message.answer(
        "<b>Ещё одно анонимное сообщение</b>\n\nПришлите текст, фото, видео или стикер.",
        reply_markup=kb.cancel_writing(),
    )
    await call.answer()


async def deliver_to_recipient(
    bot: Bot, message: Message, recipient_id: int, notify: bool
) -> None:
    """Сохраняет сообщение в БД и, если включены уведомления, доставляет его."""
    kind = "text"
    body: str | None = message.text
    file_id: str | None = None

    if message.content_type == ContentType.PHOTO:
        kind, file_id = "photo", message.photo[-1].file_id
        body = message.caption
    elif message.content_type == ContentType.VIDEO:
        kind, file_id = "video", message.video.file_id
        body = message.caption
    elif message.content_type == ContentType.STICKER:
        kind, file_id = "sticker", message.sticker.file_id
        body = None

    if kind == "text" and not (body and body.strip()):
        await message.answer("Пришлите непустой текст — или фото, видео, стикер.")
        return

    message_id = await db.add_message(
        sender_id=message.from_user.id,
        recipient_id=recipient_id,
        kind=kind,
        body=body,
        file_id=file_id,
    )

    if notify:
        header = "<b>Новое анонимное сообщение</b>"
        actions = kb.message_actions(message_id)
        if kind == "text":
            await bot.send_message(
                recipient_id,
                f"{header}\n<blockquote>{escape(body)}</blockquote>",
                reply_markup=actions,
            )
        elif kind in ("photo", "video"):
            caption = header
            if body:
                caption += f"\n<blockquote>{escape(body[:900])}</blockquote>"
            sender_fn = bot.send_photo if kind == "photo" else bot.send_video
            await sender_fn(recipient_id, file_id, caption=caption, reply_markup=actions)
        else:
            await bot.send_message(
                recipient_id,
                f"{header}\n<i>Отправлен стикер. Автор неизвестен.</i>",
                reply_markup=actions,
            )
            await bot.send_sticker(recipient_id, file_id)


@router.message(SendAnon.writing, F.content_type.in_(MEDIA_ALLOWED))
async def on_anon_message(message: Message, state: FSMContext, bot: Bot) -> None:
    data = await state.get_data()
    recipient_id = data.get("recipient_id")
    if not recipient_id:
        await state.clear()
        await message.answer("Получатель не найден. Откройте ссылку заново.")
        return

    if await db.is_banned(recipient_id, message.from_user.id):
        await state.clear()
        await message.answer("Не удалось отправить сообщение. Попробуйте позже.")
        return

    recipient = await db.get_user(recipient_id)
    if recipient is None:
        await state.clear()
        await message.answer(
            "<b>Пользователь недоступен.</b>\nВладелец ссылки отключил бота."
        )
        return

    try:
        await deliver_to_recipient(
            bot, message, recipient_id, notify=bool(recipient.get("notifications", 1))
        )
    except TelegramForbiddenError:
        await state.clear()
        await message.answer(
            "<b>Пользователь недоступен.</b>\n"
            "Владелец ссылки остановил бота — сообщение не может быть доставлено."
        )
        return

    await state.clear()
    await message.answer(
        "<b>Сообщение доставлено.</b>\n"
        "Получатель видит только содержимое — ваше имя останется в секрете.",
        reply_markup=kb.after_send(recipient_id),
    )


@router.message(SendAnon.writing)
async def on_anon_unsupported(message: Message) -> None:
    await message.answer(
        "Поддерживаются текст, фото, видео и стикеры.\nПришлите сообщение в одном из этих форматов.",
        reply_markup=kb.cancel_writing(),
    )


# ——————————————————— Анонимный ответ владельца ———————————————————


@router.message(ReplyAnon.writing, F.content_type == ContentType.TEXT)
async def on_reply_text(message: Message, state: FSMContext, bot: Bot) -> None:
    data = await state.get_data()
    message_id = data.get("reply_message_id")
    original = await db.get_message(int(message_id)) if message_id else None

    if not original:
        await state.clear()
        await message.answer("Исходное сообщение не найдено.", reply_markup=kb.main_menu())
        return

    reply = (message.text or "").strip()
    if not reply:
        await message.answer("Ответ не должен быть пустым.")
        return

    try:
        await bot.send_message(
            original["sender_id"],
            "<b>Ответ на ваше анонимное сообщение</b>\n"
            f"<blockquote>{escape(reply[:3500])}</blockquote>",
        )
    except TelegramForbiddenError:
        await state.clear()
        await message.answer(
            "<b>Ответ не доставлен.</b>\nАвтор сообщения остановил бота.",
            reply_markup=kb.main_menu(),
        )
        return

    await state.clear()
    await message.answer(
        "<b>Ответ отправлен.</b>\nАвтор увидит его, не узнав, кто вы.",
        reply_markup=kb.main_menu(),
    )


@router.message(ReplyAnon.writing)
async def on_reply_unsupported(message: Message) -> None:
    await message.answer(
        "Ответить можно только текстом.", reply_markup=kb.cancel_writing()
    )


# ————————————————————————— Запуск —————————————————————————


async def on_startup(bot: Bot) -> None:
    await bot.set_my_commands(
        [
            BotCommand(command="start", description="Главное меню и моя ссылка"),
            BotCommand(command="link", description="Показать мою ссылку"),
            BotCommand(command="inbox", description="Мои анонимные сообщения"),
            BotCommand(command="about", description="О проекте и создателе"),
        ]
    )
    await bot.set_my_short_description("Анонимные сообщения. Проект создан Rin.")
    await bot.set_my_description(
        "Получайте честные анонимные сообщения: одна ссылка — и вам "
        "напишут то, что не решатся сказать вслух.\n\n"
        "Проект создан Rin — https://t.me/Rinbland"
    )
    log.info("UMBRA запущен. Проект создан %s (%s)", settings.creator_name, settings.creator_url)


async def main() -> None:
    await db.init_db()
    bot = Bot(
        token=settings.bot_token,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )
    dp = Dispatcher(storage=MemoryStorage())
    dp.include_router(router)
    dp.startup.register(on_startup)
    await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())


if __name__ == "__main__":
    asyncio.run(main())
