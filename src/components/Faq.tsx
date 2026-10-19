"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const ITEMS = [
  {
    q: "Отправитель действительно анонимен?",
    a: "Да. Бот технически не передаёт имя, юзернейм или ссылку на профиль. Идентификатор отправителя хранится только у системы — он нужен для блокировки нарушителей и нигде не отображается.",
  },
  {
    q: "Что можно отправлять?",
    a: "Текст, фотографии, видео и стикеры. Для каждого типа вложения анонимность сохраняется одинаково: получатель видит только содержимое.",
  },
  {
    q: "Как заблокировать грубияна?",
    a: "Под каждым входящим сообщением есть кнопка «Заблокировать отправителя». Пользователь попадает в ваш личный бан-лист и больше не сможет писать вам — при этом вы не узнаете, кто это был.",
  },
  {
    q: "Можно ли ответить на сообщение?",
    a: "Да, кнопка «Ответить» отправляет реплику автору сообщения. Он получит её как ответ «владельца ссылки» — обе стороны остаются невидимыми друг для друга.",
  },
  {
    q: "Это бесплатно?",
    a: "Полностью. Проект создан Rin как открытый эксперимент: код опубликован, хостинг — на бесплатных тарифах, инструкция по развёртыванию доступна на странице «Деплой».",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p className="section-tag">{"// 05 — Вопросы"}</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-mist md:text-[2.4rem]">
            Частые
            <br />
            <span className="text-gradient">вопросы</span>
          </h2>
          <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-dim">
            Коротко о приватности, медиа и стоимости. Всё остальное — в разделе
            «О создателе» и в самом боте по команде /about.
          </p>
        </Reveal>

        <div className="space-y-3">
          {ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 0.06}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-400 ${
                    open ? "border-accent/25 bg-surface" : "border-line bg-surface/50"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className={`text-[15px] font-medium transition-colors duration-300 ${open ? "text-mist" : "text-dim"}`}>
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                        open ? "border-accent/30 text-accent" : "border-line text-faint"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" strokeWidth={1.8} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="px-6 pb-6 text-[13.5px] leading-relaxed text-dim">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
