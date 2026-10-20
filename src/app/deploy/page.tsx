import Link from "next/link";
import type { ReactNode } from "react";
import {
  Bot,
  Rocket,
  Globe,
  ShieldCheck,
  Link2,
  Server,
  Database,
  KeyRound,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { CodeBlock } from "@/components/CodeBlock";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Деплой — UMBRA",
  description: "Бесплатный хостинг бота (Render, Railway, Fly.io, Oracle) и сайта (Vercel).",
};

const PREP = `# 1. Поговорите с @BotFather и получите токен
/newbot → имя бота → юзернейм → готовый токен

# 2. Клонируйте репозиторий
git clone https://github.com/you/umbra.git
cd umbra/bot

# 3. Создайте .env из шаблона (реальный токен — только здесь)
cp .env.example .env
#   BOT_TOKEN=ваш_токен
#   BOT_USERNAME=юзернейм_бота_без_собачки

# 4. Локальная проверка
pip install -r requirements.txt
python main.py`;

const RENDER_CMDS = `# Build Command:
pip install -r bot/requirements.txt

# Start Command (Background Worker / Web Service):
python bot/main.py

# Environment Variables (Settings → Environment):
BOT_TOKEN=ваш_токен_от_BotFather
BOT_USERNAME=anononsad_bot
DB_PATH=umbra.db`;

const FLY_CMDS = `# Установите flyctl и авторизуйтесь
curl -L https://fly.io/install.sh | sh
fly auth login

# Из папки bot/ — создаст fly.toml автоматически
cd bot
fly launch --no-deploy

# Секреты — через CLI, не в коде
fly secrets set BOT_TOKEN=ваш_токен BOT_USERNAME=anononsad_bot

# Запуск
fly deploy`;

const ORACLE_CMDS = `# На инстансе Ubuntu (Oracle Cloud Always Free, ARM):
sudo apt update && sudo apt install -y python3-venv git
git clone https://github.com/you/umbra.git && cd umbra/bot
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env && nano .env      # впишите токен

# Автозапуск как сервис:
sudo tee /etc/systemd/system/umbra.service <<'EOF'
[Unit]
Description=UMBRA anon messages bot
After=network.target

[Service]
WorkingDirectory=/home/ubuntu/umbra/bot
ExecStart=/home/ubuntu/umbra/bot/.venv/bin/python main.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl enable --now umbra`;

function Step({
  num,
  icon: Icon,
  title,
  children,
  id,
}: {
  num: string;
  icon: typeof Bot;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <Reveal>
      <section id={id} className="glass scroll-mt-28 rounded-3xl p-7 md:p-10">
        <div className="flex items-start gap-5">
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-graphite font-mono text-sm text-accent sm:flex">
            {num}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-mist md:text-2xl">
              <Icon className="h-5 w-5 text-accent sm:hidden" strokeWidth={1.7} />
              {title}
            </h2>
            <div className="mt-5 space-y-5 text-[14px] leading-relaxed text-dim">{children}</div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function H({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 font-display text-[15px] font-semibold text-mist">{children}</h3>;
}

function L({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const Mono = ({ children }: { children: ReactNode }) => (
  <code className="rounded-md border border-line bg-graphite/70 px-1.5 py-0.5 font-mono text-[12px] text-steel">
    {children}
  </code>
);

export default function DeployPage() {
  return (
    <main className="relative">
      <Navbar />

      <section className="relative overflow-hidden pb-28 pt-36 md:pt-44">
        <div className="grid-bg absolute inset-0" aria-hidden />
        <div
          className="absolute -top-32 left-1/2 h-[360px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(ellipse, rgba(126,166,196,0.5), transparent 62%)" }}
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-4xl px-5 md:px-8">
          <Reveal>
            <p className="section-tag">{"// развёртывание"}</p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-mist md:text-5xl">
              Деплой <span className="text-gradient">за 20 минут</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-dim">
              Бот живёт на бесплатном сервере (Render / Railway / Fly.io / Oracle),
              сайт — на Vercel. Токен везде задаётся переменными окружения и никогда
              не попадает в код. Ниже — точная последовательность действий.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                { icon: Server, label: "Бот: polling, 24/7" },
                { icon: Globe, label: "Сайт: Vercel, CDN" },
                { icon: KeyRound, label: "Секреты: только env" },
                { icon: Database, label: "БД: SQLite файлом" },
              ].map((c) => (
                <span key={c.label} className="chip">
                  <c.icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.7} />
                  {c.label}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 space-y-8">
            {/* Шаг 0 */}
            <Step num="00" icon={Bot} title="Подготовка: токен и локальный запуск" id="prep">
              <L
                items={[
                  <>Откройте <Mono>@BotFather</Mono> в Telegram, отправьте <Mono>/newbot</Mono> и заберите токен.</>,
                  <>Клонируйте проект, создайте <Mono>.env</Mono> из шаблона — токен живёт только там.</>,
                  <>Проверьте запуск локально: бот должен ответить на <Mono>/start</Mono> персональной ссылкой.</>,
                ]}
              />
              <CodeBlock code={PREP} lang="bash" filename="terminal — подготовка" />
            </Step>

            {/* Шаг 1 */}
            <Step num="01" icon={Server} title="Хостинг бота — выберите вариант" id="bot">
              <p>
                Бот общается с Telegram через <b className="text-mist">long polling</b>, поэтому
                ему не нужен публичный URL — достаточно процесса, который всегда запущен.
                Четыре рабочих бесплатных варианта:
              </p>

              <H>Вариант A · Render — проще всего</H>
              <L
                items={[
                  <>Зарегистрируйтесь на <Mono>render.com</Mono> через GitHub.</>,
                  <>New → <b className="text-mist">Background Worker</b> → выберите репозиторий.</>,
                  <>Укажите команды из блока ниже и три переменные окружения.</>,
                  <>Deploy — через минуту бот онлайн. SQLite-файл лежит рядом с процессом.</>,
                ]}
              />
              <CodeBlock code={RENDER_CMDS} lang="bash" filename="render.com — настройки сервиса" />
              <p className="text-[12.5px] text-faint">
                Важно: на бесплатном тарифе Render доступны веб-сервисы, которые засыпают
                без входящего HTTP-трафика. Для long polling выбирайте Background Worker
                либо раз в 10 минут пингуйте веб-сервис бесплатным cron-сервисом
                (например, cron-job.org). Для демо-проекта этого достаточно.
              </p>

              <H>Вариант B · Railway — деплой в два клика</H>
              <L
                items={[
                  <>На <Mono>railway.app</Mono>: New Project → Deploy from GitHub repo.</>,
                  <>В Variables добавьте <Mono>BOT_TOKEN</Mono> и <Mono>BOT_USERNAME</Mono>.</>,
                  <>В Settings → Start Command: <Mono>python bot/main.py</Mono>. Готово.</>,
                ]}
              />
              <p className="text-[12.5px] text-faint">
                Railway даёт стартовые кредиты — маленький polling-бот укладывается
                в них надолго. Следите за графой Usage в панели.
              </p>

              <H>Вариант C · Fly.io — из терминала</H>
              <CodeBlock code={FLY_CMDS} lang="bash" filename="fly.io — деплой CLI" />

              <H>Вариант D · Oracle Cloud Always Free — надолго и честно бесплатно</H>
              <p>
                Единственный по-настоящему вечнозелёный вариант: VM на ARM
                (4 ядра, 24 ГБ RAM) в тарифе Always Free. Чуть больше DevOps,
                зато никаких засыпаний и лимитов.
              </p>
              <CodeBlock code={ORACLE_CMDS} lang="bash" filename="oracle cloud — systemd сервис" />
            </Step>

            {/* Шаг 2 */}
            <Step num="02" icon={Globe} title="Хостинг сайта — Vercel" id="site">
              <L
                items={[
                  <>Запушьте проект в GitHub (помните: <Mono>.env</Mono> исключён через <Mono>.gitignore</Mono>).</>,
                  <>На <Mono>vercel.com</Mono>: Add New → Project → Import репозитория.</>,
                  <>Framework определится как Next.js автоматически — нажмите Deploy.</>,
                  <>Через минуту сайт доступен по адресу вида <Mono>umbra.vercel.app</Mono>.</>,
                ]}
              />
              <p>
                Альтернативы: <b className="text-mist">Netlify</b> (тот же сценарий, plugin Next.js
                ставится автоматически) и <b className="text-mist">GitHub Pages</b> — для него нужен
                статический экспорт (<Mono>output: &quot;export&quot;</Mono> в next.config);
                в этом режиме API-роуты мини-приложения недоступны, останется лендинг.
              </p>
            </Step>

            {/* Шаг 3 */}
            <Step num="03" icon={Link2} title="Связка бота и сайта" id="webapp">
              <L
                items={[
                  <>У <Mono>@BotFather</Mono>: <Mono>/mybots</Mono> → ваш бот → Bot Settings → Menu Button → задайте URL <Mono>https://ваш-домен/app</Mono>. Кнопка мини-приложения появится у всех пользователей.</>,
                  <>Там же через <Mono>/setdescription</Mono> и <Mono>/setabouttext</Mono> укажите описание — бот при первом запуске сам проставляет его кодом, но через BotFather надёжнее.</>,
                  <>В <Mono>main.py</Mono> упоминание создателя уже вшито в <Mono>/about</Mono>: «Проект создан Rin» со ссылкой <Mono>t.me/Rinbland</Mono>.</>,
                ]}
              />
            </Step>

            {/* Шаг 4 */}
            <Step num="04" icon={ShieldCheck} title="Чек-лист безопасности" id="security">
              <L
                items={[
                  <>Токен — только в переменных окружения хостинга и локальном <Mono>.env</Mono>. В репозитории — никогда. Если токен утёк, отзовите его у @BotFather командой <Mono>/revoke</Mono>.</>,
                  <>Убедитесь, что <Mono>.env</Mono>, <Mono>umbra.db</Mono> и <Mono>__pycache__/</Mono> перечислены в <Mono>.gitignore</Mono> (в проекте уже сделано).</>,
                  <>ID отправителей хранятся лишь для банов: интерфейс и мини-приложение их не показывают. Удаление данных пользователя стирает всё — см. <Mono>delete_user_data()</Mono>.</>,
                  <>Для продакшена с нагрузкой переведите бота на PostgreSQL и webhook — архитектура проекта это позволяет без переписывания.</>,
                ]}
              />
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/code" className="btn-ghost text-sm">
                  Вернуться к коду
                </Link>
                <a href={SITE.botUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm">
                  Проверить бота
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </a>
              </div>
            </Step>
          </div>

          <Reveal delay={0.1} className="mt-12">
            <p className="flex items-center justify-center gap-2 text-center text-[13px] text-faint">
              <Rocket className="h-4 w-4 text-accent" strokeWidth={1.7} />
              Проект создан{" "}
              <a
                href={SITE.creatorUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline text-steel hover:text-accent"
              >
                Rin
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
