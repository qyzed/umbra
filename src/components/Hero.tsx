"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDown, ShieldCheck } from "lucide-react";
import { ChatMock } from "@/components/ChatMock";
import { staggerParent, staggerChild } from "@/components/Reveal";
import { SITE } from "@/lib/site";

const STATS = [
  { value: "12 400+", label: "анонимных сообщений" },
  { value: "1 100+", label: "персональных ссылок" },
  { value: "100%", label: "анонимность, всегда" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      {/* Фон: сетка + свечения */}
      <div className="grid-bg absolute inset-0" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-[130px]"
        style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.55), transparent 62%)" }}
        aria-hidden
      />
      <div
        className="absolute right-[-180px] top-1/3 h-[420px] w-[420px] rounded-full opacity-15 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(126,166,196,0.5), transparent 65%)" }}
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-5 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div variants={staggerParent} initial="hidden" animate="show">
          <motion.div variants={staggerChild}>
            <span className="chip">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" strokeWidth={1.8} />
              Telegram-бот · deep link · анонимность
            </span>
          </motion.div>

          <motion.h1
            variants={staggerChild}
            className="mt-7 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-mist sm:text-6xl md:text-[4.2rem]"
          >
            Услышь то,
            <br />
            <span className="text-gradient">чего не скажут</span>
            <br />
            вслух
            <span className="animate-blink text-accent">_</span>
          </motion.h1>

          <motion.p
            variants={staggerChild}
            className="mt-7 max-w-md text-[15px] leading-relaxed text-dim md:text-base"
          >
            Одна персональная ссылка — и друзья, подписчики и коллеги смогут
            написать вам анонимно: текст, фото, видео и стикеры. Без регистрации,
            прямо в Telegram.
          </motion.p>

          <motion.div variants={staggerChild} className="mt-10 flex flex-wrap items-center gap-4">
            <a href={SITE.botUrl} target="_blank" rel="noreferrer" className="btn-primary">
              Открыть бота
              <ArrowUpRight className="h-4.5 w-4.5" strokeWidth={2.2} />
            </a>
            <a href="#how" className="btn-ghost">
              Как это работает
              <ArrowDown className="h-4 w-4" strokeWidth={1.8} />
            </a>
          </motion.div>

          <motion.dl
            variants={staggerChild}
            className="mt-14 grid max-w-lg grid-cols-3 divide-x divide-line border-y border-line"
          >
            {STATS.map((s) => (
              <div key={s.label} className="px-4 py-4 first:pl-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-lg font-semibold text-mist md:text-xl">{s.value}</dd>
                <dd className="mt-1 text-[11px] leading-snug text-faint">{s.label}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.p variants={staggerChild} className="mt-8 text-[13px] text-faint">
            Проект создан{" "}
            <a
              href={SITE.creatorUrl}
              target="_blank"
              rel="noreferrer"
              className="link-underline font-medium text-steel hover:text-accent"
            >
              {SITE.creator} →
            </a>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/orb.jpg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-30 mix-blend-screen [mask-image:radial-gradient(circle,black_25%,transparent_68%)]"
          />
          <div
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[90px]"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.6), transparent 60%)" }}
            aria-hidden
          />
          <div className="animate-float-slow">
            <ChatMock />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
