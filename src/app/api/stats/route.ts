import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { umbraBans, umbraMessages } from "@/db/schema";
import { DEMO_OWNER, ensureSeeded } from "@/lib/demo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(umbraMessages)
      .where(eq(umbraMessages.recipientTgId, DEMO_OWNER))
      .orderBy(desc(umbraMessages.id))
      .limit(500);

    const bans = await db.select().from(umbraBans).where(eq(umbraBans.ownerId, DEMO_OWNER));

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekAgo = startOfDay - 6 * 86400_000;

    const days: Array<{ date: string; label: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfDay - i * 86400_000);
      days.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("ru-RU", { weekday: "short" }),
        count: 0,
      });
    }

    let today = 0;
    let unread = 0;
    const kinds: Record<string, number> = { text: 0, photo: 0, video: 0, sticker: 0 };

    for (const m of rows) {
      const ts = new Date(m.createdAt).getTime();
      if (ts >= startOfDay) today += 1;
      if (!m.isRead) unread += 1;
      if (m.kind in kinds) kinds[m.kind] += 1;
      if (ts >= weekAgo) {
        const key = new Date(
          new Date(m.createdAt).getFullYear(),
          new Date(m.createdAt).getMonth(),
          new Date(m.createdAt).getDate(),
        )
          .toISOString()
          .slice(0, 10);
        const bucket = days.find((d) => d.date === key);
        if (bucket) bucket.count += 1;
      }
    }

    return NextResponse.json({
      total: rows.length,
      today,
      unread,
      bans: bans.length,
      kinds,
      days,
    });
  } catch (error) {
    console.error("[api/stats]", error);
    return NextResponse.json({ error: "Не удалось загрузить статистику" }, { status: 500 });
  }
}
