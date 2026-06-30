import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { journalEntries, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureUser();
    
    const result = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, 1))
      .orderBy(desc(journalEntries.createdAt))
      .limit(50);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUser();
    
    const body = await request.json();
    const { title, content, moodLabel } = body;

    const result = await db
      .insert(journalEntries)
      .values({
        userId: 1,
        title: title || null,
        content,
        moodLabel: moodLabel || null,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json({ error: "Failed to save entry" }, { status: 500 });
  }
}

async function ensureUser() {
  const existing = await db.select().from(users).where(eq(users.id, 1)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({ id: 1, name: "Guest" });
  }
}
