import Link from "next/link";
import { Ghost, ArrowUpRight, Send, Code2, Rocket } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-coal/60">
      {/* CTA-полоса */}
      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div
          className="absolute left-1/2 top-1/2 h-[300px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[110px]"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.6), transparent 62%)" }}
          aria-hidden
        />
        <Reveal className="relative text-center">
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight text-mist md:text-[2.8rem]">
            Готовы услышать
            <br />
            <span className="text-gradient">правду о себе?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-dim">
            Один тап — и персональная ссылка уже у вас. Дальше слово за ними.
          </p>
          <a
            href={SITE.botUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-10 text-base"
          >
            <Send className="h-4.5 w-4.5" strokeWidth={2} />
            Открыть бота в Telegram
            <ArrowUpRight className="h-4.5 w-4.5" strokeWidth={2.2} />
          </a>
        </Reveal>
      </div>

      {/* Нижняя часть */}
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-5 py-10 md:flex-row md:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-graphite">
              <Ghost className="h-4.5 w-4.5 text-accent" strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-display text-[13px] font-semibold tracking-[0.2em] text-mist">{SITE.name}</p>
              <p className="text-[11px] text-faint">анонимные сообщения · без эмодзи</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] text-dim">
            <Link href="/code" className="link-underline flex items-center gap-1.5 hover:text-mist">
              <Code2 className="h-3.5 w-3.5 text-steel" strokeWidth={1.8} />
              Исходный код
            </Link>
            <Link href="/deploy" className="link-underline flex items-center gap-1.5 hover:text-mist">
              <Rocket className="h-3.5 w-3.5 text-steel" strokeWidth={1.8} />
              Деплой
            </Link>
            <a
              href={SITE.creatorUrl}
              target="_blank"
              rel="noreferrer"
              className="link-underline hover:text-mist"
            >
              Telegram создателя
            </a>
          </nav>

          <p className="text-center text-[12px] leading-relaxed text-faint md:text-right">
            Проект создан{" "}
            <a
              href={SITE.creatorUrl}
              target="_blank"
              rel="noreferrer"
              className="link-underline font-medium text-steel hover:text-accent"
            >
              {SITE.creator}
            </a>
            <br />
            <span className="font-mono text-[10.5px]">{SITE.creatorHandle} · {new Date().getFullYear()}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
