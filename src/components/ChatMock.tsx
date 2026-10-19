"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Send, EyeOff, BellPlus, Image as ImageIcon, Sticker } from "lucide-react";

const FEED = [
  { kind: "text", body: "Ты всегда так спокойно держишься. Как у тебя это получается?", time: "21:04" },
  { kind: "text", body: "Признаюсь честно: мне нравится, как ты рассказываешь истории.", time: "21:05" },
  { kind: "photo", body: "Фото · отправитель скрыт", time: "21:06" },
  { kind: "text", body: "Пишу анонимно, потому что вслух не решусь. Ты классный человек.", time: "21:06" },
  { kind: "sticker", body: "Стикер · отправитель скрыт", time: "21:07" },
  { kind: "text", body: "Кто-то из нашего чата явно к тебе неравнодушен. Догадаешься, кто?", time: "21:08" },
];

type Msg = (typeof FEED)[number] & { id: number };

export function ChatMock() {
  const [msgs, setMsgs] = useState<Msg[]>([{ ...FEED[0], id: 0 }]);
  const [typing, setTyping] = useState(false);
  const counter = useRef(1);

  useEffect(() => {
    let alive = true;
    let timeout: ReturnType<typeof setTimeout>;

    const step = () => {
      setTyping(true);
      timeout = setTimeout(() => {
        if (!alive) return;
        setTyping(false);
        setMsgs((prev) => {
          const next = { ...FEED[counter.current % FEED.length], id: counter.current };
          counter.current += 1;
          return [...prev, next].slice(-4);
        });
      }, 950);
    };

    const interval = setInterval(step, 3000);
    return () => {
      alive = false;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="relative">
      {/* Плавающие подсказки вокруг телефона */}
      <div className="absolute -left-10 top-16 z-10 hidden animate-float sm:block">
        <div className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-card">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-graphite">
            <EyeOff className="h-4 w-4 text-accent" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-xs font-semibold text-mist">Отправитель скрыт</p>
            <p className="text-[11px] text-faint">анонимность 100%</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-8 bottom-24 z-10 hidden animate-float-slow sm:block">
        <div className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-card">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-graphite">
            <BellPlus className="h-4 w-4 text-steel" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-xs font-semibold text-mist">+1 сообщение</p>
            <p className="text-[11px] text-faint">только что</p>
          </div>
        </div>
      </div>

      {/* Корпус телефона */}
      <div className="relative w-[300px] overflow-hidden rounded-[2.6rem] border border-line-strong bg-coal shadow-card md:w-[330px]">
        <div className="absolute inset-x-0 top-0 z-20 flex justify-center">
          <div className="mt-2.5 h-5 w-24 rounded-full bg-black/80" />
        </div>

        {/* Шапка чата */}
        <div className="flex items-center gap-3 border-b border-line bg-surface/80 px-5 pb-3.5 pt-11">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/25 bg-accent-deep">
            <Ghost className="h-4 w-4 text-accent" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[11px] font-semibold tracking-[0.18em] text-mist">UMBRA</p>
            <p className="text-[11px] text-accent">бот · онлайн</p>
          </div>
          <span className="ml-auto h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
        </div>

        {/* Сообщения */}
        <div className="flex h-[340px] flex-col justify-end gap-2.5 overflow-hidden bg-gradient-to-b from-coal to-ink px-3.5 py-4">
          <p className="mb-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            входящие · сегодня
          </p>
          <AnimatePresence initial={false} mode="popLayout">
            {msgs.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 22, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="anon-quote py-2.5! px-3.5! text-[12.5px] leading-snug text-mist/90"
              >
                {m.kind === "photo" ? (
                  <span className="flex items-center gap-2 text-steel">
                    <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {m.body}
                  </span>
                ) : m.kind === "sticker" ? (
                  <span className="flex items-center gap-2 text-steel">
                    <Sticker className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {m.body}
                  </span>
                ) : (
                  m.body
                )}
                <span className="mt-1 block text-right font-mono text-[9.5px] text-faint">{m.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="anon-quote w-24 py-3! px-4!"
              >
                <span className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-accent/80"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Строка ввода */}
        <div className="flex items-center gap-3 border-t border-line bg-surface/80 px-4 py-3.5">
          <span className="flex-1 rounded-xl border border-line bg-graphite/60 px-3.5 py-2 text-[12px] text-faint">
            Отправить анонимно…
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-strong/90">
            <Send className="h-3.5 w-3.5 text-ink" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </div>
  );
}
