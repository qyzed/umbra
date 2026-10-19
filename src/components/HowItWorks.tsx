import { MousePointerClick, Inbox, Ban, CornerUpLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    num: "01",
    title: "Заберите ссылку",
    text: "Запустите бота командой /start — мгновенно получите персональную ссылку для анонимных сообщений.",
  },
  {
    num: "02",
    title: "Поделитесь ею",
    text: "Разместите ссылку в сторис, шапке профиля или отправьте в чат. Кнопка «Поделиться» уже встроена в бота.",
  },
  {
    num: "03",
    title: "Читайте откровения",
    text: "Входящие приходят сразу: в боте — с кнопками управления, в мини-приложении — с удобным списком и статистикой.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative border-y border-line bg-coal/40 py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-6xl gap-16 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="section-tag">{"// 02 — Как это работает"}</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-mist md:text-[2.6rem]">
              Три шага — <span className="text-gradient">и вы в деле</span>
            </h2>
          </Reveal>

          <div className="relative mt-12 space-y-10">
            <div
              className="absolute bottom-8 left-[27px] top-8 w-px"
              style={{ background: "linear-gradient(180deg, rgba(52,211,153,0.45), rgba(52,211,153,0.05))" }}
              aria-hidden
            />
            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.12}>
                <div className="group relative flex gap-6">
                  <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-graphite font-mono text-sm text-accent transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-glow">
                    {s.num}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-display text-[17px] font-semibold text-mist">{s.title}</h3>
                    <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-dim">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Демо входящего сообщения */}
        <Reveal delay={0.15} className="lg:pt-24">
          <div className="glass relative overflow-hidden rounded-3xl p-7 shadow-card md:p-9">
            <div className="flex items-center gap-2.5 text-faint">
              <Inbox className="h-4 w-4 text-accent" strokeWidth={1.8} />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em]">новое анонимное сообщение</span>
            </div>

            <blockquote className="anon-quote mt-5 text-[15px] leading-relaxed text-mist/90">
              Давно хотел сказать: то, что ты делаешь — вдохновляет.
              Спасибо, что не боишься быть собой. Подписано никем.
            </blockquote>

            <p className="mt-4 font-mono text-[11px] text-faint">
              отправитель: <span className="text-accent">скрыт</span> · id: <span className="text-steel">••••••••</span>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-xl border border-line bg-graphite/70 px-4 py-2.5 text-[12.5px] text-dim">
                <Ban className="h-3.5 w-3.5 text-steel" strokeWidth={1.8} />
                Заблокировать отправителя
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-accent/25 bg-accent-deep/50 px-4 py-2.5 text-[12.5px] text-accent">
                <CornerUpLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
                Ответить
              </span>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-line pt-6 text-[12px] text-faint">
              <MousePointerClick className="h-4 w-4 text-steel" strokeWidth={1.8} />
              Именно так выглядит каждое входящее внутри бота
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
