"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface JournalEntry {
  id: number;
  title: string | null;
  content: string;
  moodLabel: string | null;
  createdAt: string;
}

const prompts = [
  "What brought you a moment of peace today?",
  "What are you grateful for right now?",
  "What would you tell your past self?",
  "Describe a small victory from today.",
  "What emotion is most present right now?",
  "What do you need to let go of?",
  "What made you smile recently?",
  "Write about something you're looking forward to.",
];

const moodTags = ["Peaceful", "Grateful", "Reflective", "Hopeful", "Tender", "Brave", "Curious"];

export default function JournalPage() {
  const { ready } = useAuthGuard();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMoodTag, setSelectedMoodTag] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadEntries();
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [loadEntries]);

  // Auto-save effect
  useEffect(() => {
    if (!isWriting || !content.trim()) return;
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(() => {
      // Auto-save indicator would go here
    }, 3000);
    return () => {
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    };
  }, [content, isWriting]);

  const saveEntry = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || null,
          content,
          moodLabel: selectedMoodTag,
        }),
      });
      await loadEntries();
      setIsWriting(false);
      setTitle("");
      setContent("");
      setSelectedMoodTag(null);
    } catch { /* ignore */ }
    setSaving(false);
  };

  const startWriting = () => {
    setIsWriting(true);
    setTimeout(() => contentRef.current?.focus(), 300);
  };

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
            className="flex items-start justify-between mb-12"
          >
            <div>
              <h1
                className="text-4xl md:text-5xl font-light text-stone-800 mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Journal
              </h1>
              <p className="text-stone-400 text-base font-light">
                A space for your thoughts to breathe
              </p>
            </div>
            {!isWriting && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={startWriting}
                className="w-12 h-12 rounded-2xl bg-stone-800 text-warm-white flex items-center justify-center hover:bg-stone-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </motion.button>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {isWriting ? (
              <motion.div
                key="writing"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {/* Writing Surface */}
                <div className="bg-warm-white rounded-3xl border border-stone-100 shadow-[0_4px_40px_rgba(0,0,0,0.04)] overflow-hidden">
                  {/* Prompt */}
                  <div className="px-7 md:px-10 pt-8 pb-4 border-b border-stone-50">
                    <p className="text-xs font-medium text-stone-300 tracking-widest uppercase mb-2">
                      Reflection prompt
                    </p>
                    <p className="text-sm text-stone-400 italic font-light">{currentPrompt}</p>
                  </div>

                  {/* Title */}
                  <div className="px-7 md:px-10 pt-6">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title (optional)"
                      className="w-full text-2xl font-light text-stone-800 placeholder:text-stone-200 outline-none bg-transparent tracking-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="px-7 md:px-10 pt-4 pb-6">
                    <textarea
                      ref={contentRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Begin writing..."
                      rows={12}
                      className="journal-textarea w-full text-[15px] text-stone-600 font-light leading-[2]"
                    />
                  </div>

                  {/* Mood Tag */}
                  <div className="px-7 md:px-10 pb-6">
                    <p className="text-xs font-medium text-stone-300 tracking-widest uppercase mb-3">
                      Tag a feeling
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {moodTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedMoodTag(selectedMoodTag === tag ? null : tag)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                            selectedMoodTag === tag
                              ? "bg-forest-200 text-forest-700"
                              : "bg-stone-50 text-stone-400 hover:bg-stone-100"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-7 md:px-10 py-5 bg-parchment/30 border-t border-stone-50 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsWriting(false);
                        setTitle("");
                        setContent("");
                        setSelectedMoodTag(null);
                      }}
                      className="text-sm text-stone-400 hover:text-stone-600 transition-colors duration-300"
                    >
                      Discard
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-300">
                        {content.length > 0 ? `${content.split(/\s+/).filter(Boolean).length} words` : ""}
                      </span>
                      <button
                        onClick={saveEntry}
                        disabled={!content.trim() || saving}
                        className="px-6 py-2.5 rounded-xl bg-stone-800 text-warm-white text-sm font-medium hover:bg-stone-700 transition-all duration-300 disabled:opacity-40 active:scale-95"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="entries"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {entries.length > 0 ? (
                  <div className="space-y-4">
                    {entries.map((entry, i) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const }}
                        className="group bg-warm-white rounded-2xl border border-stone-100 p-6 md:p-7 hover:shadow-[0_4px_30px_rgba(0,0,0,0.04)] transition-all duration-500 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            {entry.title && (
                              <h3 className="text-lg font-semibold text-stone-700 mb-1 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {entry.title}
                              </h3>
                            )}
                            <p className="text-xs text-stone-300">
                              {new Date(entry.createdAt).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          {entry.moodLabel && (
                            <span className="px-3 py-1 rounded-lg bg-forest-100 text-forest-600 text-xs font-medium">
                              {entry.moodLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-400 leading-relaxed line-clamp-3 font-light">
                          {entry.content}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-parchment flex items-center justify-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-300" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                    </div>
                    <p
                      className="text-xl font-light text-stone-500 mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Your journal awaits
                    </p>
                    <p className="text-sm text-stone-300 mb-8">
                      Begin writing to capture your thoughts
                    </p>
                    <button
                      onClick={startWriting}
                      className="px-6 py-3 rounded-xl bg-stone-800 text-warm-white text-sm font-medium hover:bg-stone-700 transition-all duration-300 hover:shadow-lg active:scale-95"
                    >
                      Start writing
                    </button>
                  </motion.div>
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
