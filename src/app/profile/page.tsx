"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { signOut, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Stats {
  moodCount: number;
  journalCount: number;
  breathingMinutes: number;
  avgMood: number;
  currentStreak: number;
  recentMoods: Array<{ value: number; createdAt: string }>;
}

const achievements = [
  { title: "First Step", desc: "Logged your first mood", icon: "🌱", unlocked: true },
  { title: "Wordsmith", desc: "Wrote 5 journal entries", icon: "✍️", unlocked: false },
  { title: "Deep Breather", desc: "10 minutes of breathing", icon: "🌬️", unlocked: false },
  { title: "Self-Aware", desc: "7 day mood streak", icon: "🪞", unlocked: false },
  { title: "Inner Peace", desc: "30 breathing sessions", icon: "🧘", unlocked: false },
  { title: "Storyteller", desc: "20 journal entries", icon: "📖", unlocked: false },
];

export default function ProfilePage() {
  const router = useRouter();
  const { ready } = useAuthGuard();
  const [stats, setStats] = useState<Stats>({
    moodCount: 0,
    journalCount: 0,
    breathingMinutes: 0,
    avgMood: 0,
    currentStreak: 0,
    recentMoods: [],
  });

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/user/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statCards = [
    { label: "Moods Logged", value: stats.moodCount, color: "from-forest-100 to-forest-200", icon: "🌿" },
    { label: "Journal Entries", value: stats.journalCount, color: "from-gold-100 to-gold-200", icon: "📝" },
    { label: "Breathing Minutes", value: stats.breathingMinutes, color: "from-ocean-100 to-ocean-200", icon: "🌊" },
    { label: "Average Mood", value: stats.avgMood > 0 ? stats.avgMood.toFixed(1) : "—", color: "from-lavender-100 to-lavender-200", icon: "✨" },
  ];

  if (!ready) {
    return <div className="min-h-screen bg-cream" />;
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      <div className="pt-24 md:pt-32 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex items-center gap-5 mb-12"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-lavender-200 via-lavender-300 to-ocean-200 flex items-center justify-center text-2xl md:text-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              🌸
            </div>
            <div>
              <h1
                className="text-3xl md:text-4xl font-light text-stone-800"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Your Space
              </h1>
              <p className="text-stone-400 text-sm font-light mt-1">
                Your wellness journey at a glance
              </p>
            </div>
          </motion.div>

          {/* Streak */}
          {stats.currentStreak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
              className="mb-8 bg-gradient-to-r from-forest-100 via-forest-200 to-ocean-100 rounded-2xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center text-xl">
                🔥
              </div>
              <div>
                <p className="text-2xl font-semibold text-stone-800">{stats.currentStreak} day streak</p>
                <p className="text-sm text-stone-500 font-light">Keep showing up for yourself</p>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-10">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 md:p-6`}
              >
                <span className="text-xl mb-3 block">{stat.icon}</span>
                <p className="text-2xl md:text-3xl font-light text-stone-800 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-stone-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Mood Trend Mini */}
          {stats.recentMoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              className="bg-warm-white rounded-3xl border border-stone-100 p-6 md:p-8 mb-8"
            >
              <p className="text-xs font-medium text-stone-400 tracking-widest uppercase mb-5">
                Mood Trend — Last 7 Days
              </p>
              <div className="flex items-end gap-3 h-20">
                {stats.recentMoods.slice(0, 7).reverse().map((mood, i) => {
                  const moodColors: Record<number, string> = {
                    1: "#D4AEAE",
                    2: "#D4C48A",
                    3: "#B8B0A5",
                    4: "#94B8D4",
                    5: "#9EC5A8",
                  };
                  return (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${(mood.value / 5) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
                      className="flex-1 rounded-lg"
                      style={{ backgroundColor: moodColors[mood.value] || "#B8B0A5" }}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <p className="text-xs font-medium text-stone-400 tracking-widest uppercase mb-5">
              Milestones
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.06, ease: [0.22, 1, 0.36, 1] as const }}
                  className={`rounded-2xl p-4 md:p-5 border transition-all duration-300 ${
                    a.unlocked
                      ? "bg-warm-white border-stone-100 shadow-sm"
                      : "bg-parchment/50 border-transparent opacity-50"
                  }`}
                >
                  <span className="text-2xl block mb-2">{a.icon}</span>
                  <p className="text-sm font-semibold text-stone-700 mb-0.5">{a.title}</p>
                  <p className="text-xs text-stone-400 font-light">{a.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Privacy Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 p-6 rounded-2xl bg-parchment/50 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-400" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <p className="text-xs font-medium text-stone-400">Your data is private</p>
            </div>
            <p className="text-xs text-stone-300 font-light">
              All your thoughts, moods, and reflections are stored securely and never shared.
            </p>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            onClick={async () => {
              await signOut();
              router.replace("/login");
            }}
            className="w-full mt-6 py-4 rounded-2xl border border-stone-200 bg-warm-white text-sm font-medium text-stone-500 hover:text-stone-700 hover:border-stone-300 hover:shadow-sm transition-all duration-300 active:scale-[0.98]"
          >
            Log out
          </motion.button>
        </div>
      </div>

      <div className="h-24 md:h-0" />
    </main>
  );
}
