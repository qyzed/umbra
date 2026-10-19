import { ArrowUpRight, Code2, Palette, Server } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export function Creator() {
  return (
    <section id="creator" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="section-tag">{"// 04 — Создатель"}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass relative mt-8 overflow-hidden rounded-3xl p-8 shadow-card md:p-12">
            <div
              className="absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full opacity-20 blur-[100px]"
              style={{ background: "radial-gradient(circle, rgba(52,211,153,0.7), transparent 60%)" }}
              aria-hidden
            />

            <div className="relative grid items-center gap-10 md:grid-cols-[auto_1fr_auto]">
              <div className="relative">
                <span className="absolute inset-0 animate-pulse-ring rounded-3xl border border-accent/40" aria-hidden />
                <span className="flex h-24 w-24 items-center justify-center rounded-3xl border border-accent/30 bg-gradient-to-br from-graphite to-accent-deep font-display text-4xl font-semibold text-accent">
                  R
                </span>
              </div>

              <div>
                <h2 className="font-display text-3xl font-semibold text-mist md:text-4xl">Rin</h2>
                <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.3em] text-steel">
                  автор проекта UMBRA
                </p>
                <blockquote className="mt-5 max-w-lg border-l-2 border-accent/50 pl-5 text-[15px] leading-relaxed text-dim">
                  «Люди честнее, когда их никто не видит. Я собрал UMBRA, чтобы
                  дать этой честности красивую форму — от бота до мини-приложения».
                </blockquote>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {[
                    { icon: Code2, label: "Backend · aiogram 3" },
                    { icon: Palette, label: "Дизайн интерфейсов" },
                    { icon: Server, label: "Инфраструктура" },
                  ].map((t) => (
                    <span key={t.label} className="chip">
                      <t.icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.8} />
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:pl-8">
                <a
                  href={SITE.creatorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary whitespace-nowrap"
                >
                  {SITE.creatorHandle}
                  <ArrowUpRight className="h-4.5 w-4.5" strokeWidth={2.2} />
                </a>
                <p className="mt-3 text-center text-[11px] text-faint">написать в Telegram →</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
