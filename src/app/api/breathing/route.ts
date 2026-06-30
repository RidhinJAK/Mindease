import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { breathingSessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    await ensureUser();
    
    const body = await request.json();
    const { technique, durationSeconds } = body;

    const result = await db
      .insert(breathingSessions)
      .values({
        userId: 1,
        technique,
        durationSeconds,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error saving breathing session:", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}

async function ensureUser() {
  const existing = await db.select().from(users).where(eq(users.id, 1)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({ id: 1, name: "Guest" });
  }
}
