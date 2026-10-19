import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { umbraMessages } from "@/db/schema";
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
      .limit(40);

    // ID отправителя сознательно не отдаём клиенту — анонимность соблюдена.
    return NextResponse.json({
      messages: rows.map((m) => ({
        id: m.id,
        kind: m.kind,
        body: m.body,
        isRead: m.isRead,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error("[api/messages]", error);
    return NextResponse.json({ error: "Не удалось загрузить сообщения" }, { status: 500 });
  }
}
