import { SITE } from "@/lib/site";

const ITEMS = [
  "анонимно",
  "одна ссылка",
  "без регистрации",
  "текст · фото · видео · стикеры",
  "контроль банов",
  "мгновенные уведомления",
  "проект создан Rin",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-line bg-coal/60 py-4">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8" aria-hidden={half === 1}>
            {ITEMS.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-8 font-mono text-[12px] uppercase tracking-[0.3em] text-faint"
              >
                {item}
                <span className="text-accent">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
      <span className="sr-only">{SITE.tagline}</span>
    </div>
  );
}
