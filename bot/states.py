"""Конечные автоматы (FSM) для сценариев отправки и ответа."""

from aiogram.fsm.state import State, StatesGroup


class SendAnon(StatesGroup):
    """Пользователь пишет анонимное сообщение владельцу ссылки."""

    writing = State()


class ReplyAnon(StatesGroup):
    """Владелец ссылки отвечает на входящее сообщение."""

    writing = State()
