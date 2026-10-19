import { count } from "drizzle-orm";
import { db } from "@/db";
import { umbraBans, umbraMessages, umbraUsers } from "@/db/schema";

// Демо-владелец ссылки для мини-приложения в ознакомительном режиме.
export const DEMO_OWNER = 13371337;

const SAMPLE_TEXTS = [
  "Ты всегда так спокойно держишься. Как у тебя это получается?",
  "Признаюсь честно: мне нравится, как ты рассказываешь истории.",
  "Пишу анонимно, потому что вслух не решусь. Ты классный человек.",
  "Кто-то из нашего чата явно к тебе неравнодушен. Догадаешься, кто?",
  "Твоё чувство юмора — лучшее, что есть в нашем чате.",
  "Спасибо за совет на прошлой неделе. Он реально сработал.",
  "Иногда хочется подойти и поговорить, но я слишком стесняюсь.",
  "Ты заметно вырос за этот год. Видно, что работаешь над собой.",
  "Давно хотел сказать: то, что ты делаешь — вдохновляет.",
  "Пишу анонимно, но надеюсь, ты догадаешься…",
  "У тебя отличный вкус в музыке. Подборка из вчерашних историй — огонь.",
  "Будь смелее в своих решениях. У тебя всё получится.",
  "Тот разговор в гараже до сих пор вспоминаю. Смешно было ужасно.",
  "Мне кажется, ты недооцениваешь свой талант.",
  "Прости, что тогда не поддержал. Давно хотел извиниться.",
  "Ты единственный человек, с которым можно молчать и не думать ни о чём.",
];

const KINDS: Array<{ kind: string; body: string | null }> = [
  { kind: "photo", body: "Вот, смотри, какое небо сегодня." },
  { kind: "sticker", body: null },
  { kind: "video", body: "Это напомнило мне о тебе." },
  { kind: "photo", body: null },
];

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  const [row] = await db.select({ value: count() }).from(umbraMessages);
  if (Number(row?.value ?? 0) > 0) {
    seeded = true;
    return;
  }

  await db
    .insert(umbraUsers)
    .values([
      {
        tgId: DEMO_OWNER,
        username: "you",
        fullName: "Владелец ссылки",
        notifications: true,
      },
      { tgId: 700000001, username: null, fullName: null, notifications: true },
    ])
    .onConflictDoNothing();

  const HOUR = 3600_000;
  const messages: Array<typeof umbraMessages.$inferInsert> = [];
  SAMPLE_TEXTS.forEach((text, i) => {
    messages.push({
      senderTgId: 700000001 + ((i * 7919) % 500),
      recipientTgId: DEMO_OWNER,
      kind: "text",
      body: text,
      isRead: i > 4,
      createdAt: new Date(Date.now() - (i * 9 + 3) * HOUR + ((i % 3) - 1) * HOUR),
    });
  });
  KINDS.forEach((m, i) => {
    messages.push({
      senderTgId: 700000001 + ((i * 104729) % 500),
      recipientTgId: DEMO_OWNER,
      kind: m.kind,
      body: m.body,
      isRead: false,
      createdAt: new Date(Date.now() - (i * 5 + 1) * HOUR),
    });
  });

  await db.insert(umbraMessages).values(messages);
  await db
    .insert(umbraBans)
    .values([{ ownerId: DEMO_OWNER, blockedId: 700000999 }])
    .onConflictDoNothing();

  seeded = true;
}
