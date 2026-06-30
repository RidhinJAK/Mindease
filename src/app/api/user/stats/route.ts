import { NextResponse } from "next/server";
import { db } from "@/db";
import { moods, journalEntries, breathingSessions, users } from "@/db/schema";
import { eq, desc, sql, count, avg } from "drizzle-orm";

export async function GET() {
  try {
    await ensureUser();

    // Mood count
    const moodCountResult = await db
      .select({ count: count() })
      .from(moods)
      .where(eq(moods.userId, 1));
    const moodCount = moodCountResult[0]?.count ?? 0;

    // Journal count
    const journalCountResult = await db
      .select({ count: count() })
      .from(journalEntries)
      .where(eq(journalEntries.userId, 1));
    const journalCount = journalCountResult[0]?.count ?? 0;

    // Breathing minutes
    const breathingResult = await db
      .select({ total: sql<number>`COALESCE(SUM(${breathingSessions.durationSeconds}), 0)` })
      .from(breathingSessions)
      .where(eq(breathingSessions.userId, 1));
    const breathingMinutes = Math.round((breathingResult[0]?.total ?? 0) / 60);

    // Average mood
    const avgMoodResult = await db
      .select({ avg: avg(moods.value) })
      .from(moods)
      .where(eq(moods.userId, 1));
    const avgMood = avgMoodResult[0]?.avg ? parseFloat(String(avgMoodResult[0].avg)) : 0;

    // Recent moods
    const recentMoods = await db
      .select({ value: moods.value, createdAt: moods.createdAt })
      .from(moods)
      .where(eq(moods.userId, 1))
      .orderBy(desc(moods.createdAt))
      .limit(7);

    // Simple streak calculation
    let currentStreak = 0;
    if (moodCount > 0) {
      const moodDates = await db
        .select({ date: sql<string>`DATE(${moods.createdAt})` })
        .from(moods)
        .where(eq(moods.userId, 1))
        .orderBy(desc(moods.createdAt));
      
      const uniqueDates = [...new Set(moodDates.map(d => d.date))];
      const today = new Date().toISOString().split('T')[0];
      
      if (uniqueDates[0] === today || isYesterday(uniqueDates[0])) {
        currentStreak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
          const current = new Date(uniqueDates[i]);
          const previous = new Date(uniqueDates[i - 1]);
          const diffDays = Math.round((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    return NextResponse.json({
      moodCount,
      journalCount,
      breathingMinutes,
      avgMood,
      currentStreak,
      recentMoods,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({
      moodCount: 0,
      journalCount: 0,
      breathingMinutes: 0,
      avgMood: 0,
      currentStreak: 0,
      recentMoods: [],
    });
  }
}

function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

async function ensureUser() {
  const existing = await db.select().from(users).where(eq(users.id, 1)).limit(1);
  if (existing.length === 0) {
    await db.insert(users).values({ id: 1, name: "Guest" });
  }
}
