import { Link2, EyeOff, ImagePlus, Ban, Reply, BellRing } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const FEATURES = [
  {
    icon: Link2,
    title: "Персональная ссылка",
    text: "Бот генерирует уникальную ссылку вида t.me/бот?start=ваш_id. Каждый переход по ней открывает диалог для анонимного сообщения.",
  },
  {
    icon: EyeOff,
    title: "Полная анонимность",
    text: "Получатель видит только текст сообщения. Имя, юзернейм и профиль отправителя технически не передаются никому.",
  },
  {
    icon: ImagePlus,
    title: "Любые медиа",
    text: "Поддерживаются текст, фотографии, видео и стикеры. Анонимность сохраняется для любого типа вложения.",
  },
  {
    icon: Ban,
    title: "Контроль банов",
    text: "Грубияна можно заблокировать в один тап: отправитель заносится в бан-лист по ID, но вы не узнаете, кто это был.",
  },
  {
    icon: Reply,
    title: "Анонимные ответы",
    text: "Отвечайте на входящие, сохраняя невидимость: автор получит ваш ответ как сообщение от «владельца ссылки».",
  },
  {
    icon: BellRing,
    title: "Уведомления в момент",
    text: "Каждое входящее приходит мгновенно. Уведомления можно отключить в настройках и читать всё позже.",
  },
];

export function Features() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="section-tag">{"// 01 — О боте"}</p>
          <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight text-mist md:text-[2.6rem]">
            Строгий инструмент
            <br />
            для <span className="text-gradient">честных разговоров</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-dim">
            UMBRA — минималистичный бот для анонимных сообщений. Никаких лишних
            экранов: вы создаёте ссылку, они пишут — вы читаете.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <article className="card-hover group relative h-full overflow-hidden rounded-2xl border border-line bg-surface/60 p-7">
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)" }}
                  aria-hidden
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-graphite transition-colors duration-400 group-hover:border-accent/35">
                  <f.icon className="h-5 w-5 text-accent" strokeWidth={1.7} />
                </span>
                <h3 className="mt-6 font-display text-[15px] font-semibold tracking-wide text-mist">
                  {f.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-dim">{f.text}</p>
                <span className="absolute bottom-5 right-6 font-mono text-[10px] tracking-widest text-faint/60 transition-colors duration-400 group-hover:text-accent/60">
                  0{i + 1}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
