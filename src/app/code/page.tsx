import { readFileSync } from "fs";
import path from "path";
import Link from "next/link";
import { ArrowUpRight, FolderTree, ShieldCheck, TerminalSquare } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CodeTabs, type CodeFile } from "@/components/CodeTabs";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Исходный код — UMBRA",
  description: "Код бота UMBRA: aiogram 3, deep links, inline-клавиатуры без эмодзи.",
};

function readBotFile(name: string): string {
  try {
    return readFileSync(path.join(process.cwd(), "bot", name), "utf-8");
  } catch {
    return `# Файл ${name} не найден в репозитории`;
  }
}

const TREE = `umbra/
├── bot/                    # Telegram-бот (Python 3.10+, aiogram 3)
│   ├── main.py             # точка входа: роутеры, deep links, медиа
│   ├── keyboards.py        # inline-клавиатуры, без эмодзи
│   ├── database.py         # SQLite (aiosqlite): users, messages, bans
│   ├── config.py           # переменные окружения (BOT_TOKEN и др.)
│   ├── states.py           # FSM: отправка и анонимный ответ
│   ├── requirements.txt
│   ├── .env.example        # шаблон секретов (реальный .env не коммитим)
│   └── README.md
└── site/                   # этот сайт (Next.js + Tailwind + Drizzle)
    ├── лендинг             # тёмная тема, анимации, SVG-иконки
    ├── /app                # Telegram Mini App: входящие и статистика
    └── /deploy             # инструкция по бесплатному хостингу`;

export default function CodePage() {
  const files: CodeFile[] = [
    { label: "main.py", filename: "bot/main.py", lang: "python", code: readBotFile("main.py") },
    {
      label: "keyboards.py",
      filename: "bot/keyboards.py",
      lang: "python",
      code: readBotFile("keyboards.py"),
    },
    {
      label: "database.py",
      filename: "bot/database.py",
      lang: "python",
      code: readBotFile("database.py"),
    },
    { label: "config.py", filename: "bot/config.py", lang: "python", code: readBotFile("config.py") },
    { label: "states.py", filename: "bot/states.py", lang: "python", code: readBotFile("states.py") },
    {
      label: "requirements.txt",
      filename: "bot/requirements.txt",
      lang: "text",
      code: readBotFile("requirements.txt"),
    },
    {
      label: ".env.example",
      filename: "bot/.env.example",
      lang: "bash",
      code: readBotFile(".env.example"),
    },
  ];

  return (
    <main className="relative">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-36 md:pt-44">
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div
          className="absolute -top-32 left-1/3 h-[380px] w-[640px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.5), transparent 62%)" }}
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
          <Reveal>
            <p className="section-tag">{"// исходный код"}</p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-mist md:text-5xl">
              Бот <span className="text-gradient">изнутри</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-dim">
              Python 3.10+, aiogram 3.x, SQLite. Deep links, FSM, доставка медиа,
              бан-листы и анонимные ответы — весь код ниже, без сокращений.
              Токен читается только из переменных окружения.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
            {/* Структура проекта */}
            <Reveal delay={0.1}>
              <div className="glass h-full rounded-3xl p-7">
                <h2 className="flex items-center gap-2.5 font-display text-[15px] font-semibold text-mist">
                  <FolderTree className="h-4.5 w-4.5 text-accent" strokeWidth={1.7} />
                  Структура проекта
                </h2>
                <pre className="mt-5 overflow-auto font-mono text-[12px] leading-relaxed text-dim">
                  {TREE}
                </pre>
                <div className="mt-6 space-y-3 border-t border-line pt-6 text-[13px] leading-relaxed text-dim">
                  <p className="flex gap-2.5">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} />
                    Секреты — только в <code className="font-mono text-[12px] text-steel">.env</code>,
                    который исключён из Git.
                  </p>
                  <p className="flex gap-2.5">
                    <TerminalSquare className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} />
                    Запуск:{" "}
                    <code className="font-mono text-[12px] text-steel">
                      pip install -r requirements.txt && python main.py
                    </code>
                  </p>
                </div>
                <Link href="/deploy" className="btn-primary mt-7 w-full justify-center text-sm">
                  Дальше: деплой
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
            </Reveal>

            {/* Файлы */}
            <Reveal delay={0.18}>
              <CodeTabs files={files} />
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-10">
            <p className="text-center text-[13px] text-faint">
              Проект создан{" "}
              <a
                href={SITE.creatorUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline text-steel hover:text-accent"
              >
                Rin
              </a>{" "}
              · распространяется свободно · звезда в репозитории приветствуется
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
