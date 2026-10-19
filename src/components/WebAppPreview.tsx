import Link from "next/link";
import { ArrowUpRight, LayoutDashboard, Inbox, ChartColumn } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const BARS = [34, 58, 42, 72, 55, 88, 64];

export function WebAppPreview() {
  return (
    <section id="webapp" className="relative py-24 md:py-32">
      <div
        className="absolute left-[-160px] top-1/4 h-[380px] w-[380px] rounded-full opacity-15 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.55), transparent 60%)" }}
        aria-hidden
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="section-tag">{"// 03 — Мини-приложение"}</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-mist md:text-[2.6rem]">
            Все входящие —
            <br />
            в <span className="text-gradient">одном интерфейсе</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-dim">
            Telegram Web App в той же тёмной эстетике: лента сообщений, статистика
            по дням и настройки. Открывается прямо из бота — без браузера и паролей.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: Inbox, text: "Лента входящих с фильтрами по типу вложений" },
              { icon: ChartColumn, text: "Статистика: сообщения, ссылки, активность" },
              { icon: LayoutDashboard, text: "Настройки уведомлений и приватности" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3.5 text-[14px] text-dim">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-graphite">
                  <item.icon className="h-4 w-4 text-accent" strokeWidth={1.7} />
                </span>
                {item.text}
              </li>
            ))}
          </ul>

          <Link href="/app" className="btn-primary mt-10">
            Открыть демо приложения
            <ArrowUpRight className="h-4.5 w-4.5" strokeWidth={2.2} />
          </Link>
        </Reveal>

        {/* Мок интерфейса мини-приложения */}
        <Reveal delay={0.15}>
          <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-card md:p-7">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="font-display text-[13px] font-semibold tracking-[0.2em] text-mist">UMBRA</p>
                <p className="mt-0.5 text-[11px] text-faint">мини-приложение</p>
              </div>
              <span className="chip py-1.5! text-[11px]!">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                онлайн
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Всего", value: "1 248" },
                { label: "Сегодня", value: "37" },
                { label: "Новых", value: "12" },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-line bg-graphite/50 px-4 py-3.5">
                  <p className="font-display text-lg font-semibold text-mist">{c.value}</p>
                  <p className="mt-0.5 text-[11px] text-faint">{c.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-line bg-graphite/50 p-4">
              <p className="mb-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-faint">
                <ChartColumn className="h-3.5 w-3.5 text-steel" strokeWidth={1.8} />
                активность · 7 дней
              </p>
              <div className="flex h-20 items-end gap-2">
                {BARS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md transition-all duration-500 hover:opacity-100"
                    style={{
                      height: `${h}%`,
                      background:
                        i === BARS.length - 2
                          ? "linear-gradient(180deg, #34d399, #0b3b2e)"
                          : "linear-gradient(180deg, rgba(126,166,196,0.5), rgba(22,40,58,0.6))",
                      opacity: i === BARS.length - 2 ? 1 : 0.55,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="anon-quote py-2.5! px-3.5! text-[12.5px] text-mist/85">
                Твоё чувство юмора — лучшее, что есть в нашем чате.
              </div>
              <div className="anon-quote py-2.5! px-3.5! text-[12.5px] text-mist/85">
                Пишу анонимно, но надеюсь, ты догадаешься…
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
