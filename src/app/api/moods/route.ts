import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { moods } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// Get moods for default user (id=1)
export async function GET() {
  try {
    // Ensure user exists
    await ensureUser();
    
    const result = await db
      .select()
      .from(moods)
      .where(eq(moods.userId, 1))
      .orderBy(desc(moods.createdAt))
      .limit(50);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching moods:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUser();
    
    const body = await request.json();
    const { value, label, note, factors } = body;

    const result = await db
      .insert(moods)
      .values({
        userId: 1,
        value,
        label,
        note: note || null,
        factors: factors || null,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating mood:", error);
    return NextResponse.json({ error: "Failed to save mood" }, { status: 500 });
  }
}

async function ensureUser() {
  const { users } = await import("@/db/schema");
  const existing = await db.select().from(users).where(eq(users.id, 1)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({ id: 1, name: "Guest" });
  }
}
