"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface MoodEntry {
  id: number;
  value: number;
  label: string;
  note: string;
  createdAt: string;
}

const moodLevels = [
  { value: 1, label: "Struggling", color: "#D4AEAE", bgClass: "from-rose-200 to-rose-300", description: "It's okay to not be okay" },
  { value: 2, label: "Uneasy", color: "#D4C48A", bgClass: "from-gold-200 to-gold-300", description: "Acknowledging discomfort" },
  { value: 3, label: "Neutral", color: "#B8B0A5", bgClass: "from-stone-200 to-stone-300", description: "Finding your center" },
  { value: 4, label: "Content", color: "#94B8D4", bgClass: "from-ocean-200 to-ocean-400", description: "A gentle warmth" },
  { value: 5, label: "Thriving", color: "#9EC5A8", bgClass: "from-forest-200 to-forest-400", description: "Flourishing today" },
];

const factors = [
  "Sleep", "Exercise", "Social", "Work", "Nature", "Creative", "Rest", "Learning",
];

export default function MoodPage() {
  const { ready } = useAuthGuard();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [view, setView] = useState<"log" | "history">("log");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/moods");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const saveMood = async () => {
    if (selectedMood === null) return;
    setSaving(true);
    const mood = moodLevels.find((m) => m.value === selectedMood);
    try {
      await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: selectedMood,
          label: mood?.label || "",
          note,
          factors: selectedFactors,
        }),
      });
      setSaved(true);
      await loadHistory();
      setTimeout(() => {
        setSaved(false);
        setSelectedMood(null);
        setNote("");
        setSelectedFactors([]);
      }, 2000);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const currentMood = selectedMood ? moodLevels.find((m) => m.value === selectedMood) : null;

  if (!ready) {
    return <div className="min-h-screen bg-cream" />;
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      <div className="pt-24 md:pt-32 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-12"
          >
            <h1
              className="text-4xl md:text-5xl font-light text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Mood Journey
            </h1>
            <p className="text-stone-400 text-base font-light">
              Track your emotional landscape over time
            </p>
          </motion.div>

          {/* View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex gap-1 p-1 bg-stone-100/60 rounded-xl mb-10 max-w-xs"
          >
            {(["log", "history"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  view === v
                    ? "bg-warm-white shadow-sm text-stone-800"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {v === "log" ? "Log Mood" : "History"}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {view === "log" ? (
              <motion.div
                key="log"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {saved ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-forest-200 to-forest-300 flex items-center justify-center"
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest-600">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </motion.div>
                    <p className="text-xl font-light text-stone-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Moment captured
                    </p>
                    <p className="text-sm text-stone-400 mt-2">Your feelings matter</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Mood Selection */}
                    <div className="mb-10">
                      <p className="text-sm font-medium text-stone-400 tracking-widest uppercase mb-6">
                        How are you feeling?
                      </p>
                      <div className="flex items-end justify-center gap-3 md:gap-5">
                        {moodLevels.map((mood, i) => (
                          <motion.button
                            key={mood.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
                            onClick={() => setSelectedMood(mood.value)}
                            className={`group flex flex-col items-center gap-2 transition-all duration-500 ${
                              selectedMood === mood.value ? "scale-110" : "hover:scale-105"
                            }`}
                          >
                            <motion.div
                              animate={selectedMood === mood.value ? { scale: [1, 1.08, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${mood.bgClass} transition-all duration-500 ${
                                selectedMood === mood.value
                                  ? "shadow-lg ring-2 ring-offset-2 ring-offset-cream"
                                  : "opacity-60 group-hover:opacity-100"
                              }`}
                              style={selectedMood === mood.value ? { borderColor: mood.color } : {}}
                            />
                            <span className={`text-xs font-medium transition-colors duration-300 ${
                              selectedMood === mood.value ? "text-stone-700" : "text-stone-300"
                            }`}>
                              {mood.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Description */}
                      <AnimatePresence>
                        {currentMood && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-sm text-stone-400 mt-6 font-light italic"
                          >
                            {currentMood.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Factors */}
                    <AnimatePresence>
                      {selectedMood !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                          className="mb-10"
                        >
                          <p className="text-sm font-medium text-stone-400 tracking-widest uppercase mb-4">
                            What shaped this feeling?
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {factors.map((factor) => (
                              <button
                                key={factor}
                                onClick={() =>
                                  setSelectedFactors((prev) =>
                                    prev.includes(factor)
                                      ? prev.filter((f) => f !== factor)
                                      : [...prev, factor]
                                  )
                                }
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                  selectedFactors.includes(factor)
                                    ? "bg-forest-200 text-forest-700 shadow-sm"
                                    : "bg-stone-100/60 text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                                }`}
                              >
                                {factor}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Note */}
                    <AnimatePresence>
                      {selectedMood !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                          className="mb-10"
                        >
                          <p className="text-sm font-medium text-stone-400 tracking-widest uppercase mb-4">
                            Add a thought
                          </p>
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="What's on your mind right now?"
                            rows={3}
                            className="w-full bg-warm-white border border-stone-100 rounded-2xl px-5 py-4 text-[15px] text-stone-700 placeholder:text-stone-300 outline-none focus:border-forest-200 focus:shadow-[0_0_0_3px_rgba(158,197,168,0.15)] transition-all duration-300 resize-none leading-relaxed"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Save */}
                    <AnimatePresence>
                      {selectedMood !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                        >
                          <button
                            onClick={saveMood}
                            disabled={saving}
                            className="w-full py-4 rounded-2xl bg-stone-800 text-warm-white text-sm font-medium hover:bg-stone-700 transition-all duration-300 hover:shadow-lg active:scale-[0.98] disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Capture this moment"}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {/* Mood History Visualization */}
                {history.length > 0 ? (
                  <div className="space-y-4">
                    {/* Mini Chart */}
                    <div className="bg-warm-white rounded-3xl border border-stone-100 p-6 md:p-8 mb-8">
                      <p className="text-xs font-medium text-stone-400 tracking-widest uppercase mb-6">
                        Recent Emotional Flow
                      </p>
                      <div className="flex items-end gap-2 h-32">
                        {history.slice(0, 14).reverse().map((entry, i) => {
                          const mood = moodLevels.find((m) => m.value === entry.value);
                          const height = (entry.value / 5) * 100;
                          return (
                            <motion.div
                              key={entry.id}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const }}
                              className="flex-1 rounded-lg min-w-[8px]"
                              style={{ backgroundColor: mood?.color || "#B8B0A5" }}
                              title={`${entry.label} — ${new Date(entry.createdAt).toLocaleDateString()}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Entry List */}
                    <div className="space-y-3">
                      {history.map((entry, i) => {
                        const mood = moodLevels.find((m) => m.value === entry.value);
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const }}
                            className="bg-warm-white rounded-2xl border border-stone-100 p-5 hover:shadow-sm transition-all duration-300"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-xl flex-shrink-0"
                                style={{ background: `linear-gradient(135deg, ${mood?.color}40, ${mood?.color})` }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-stone-700">{entry.label}</span>
                                  <span className="text-xs text-stone-300">
                                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                {entry.note && (
                                  <p className="text-sm text-stone-400 mt-1 truncate">{entry.note}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-300">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                    </div>
                    <p className="text-stone-400 text-sm">No moods logged yet</p>
                    <p className="text-stone-300 text-xs mt-1">Start by logging how you feel</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-24 md:h-0" />
    </main>
  );
}
