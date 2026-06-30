"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

const moodOptions = [
  { label: "Peaceful", value: 5, color: "from-forest-300 to-forest-400", emoji: "🌿" },
  { label: "Content", value: 4, color: "from-ocean-300 to-ocean-400", emoji: "🌊" },
  { label: "Neutral", value: 3, color: "from-stone-200 to-stone-300", emoji: "☁️" },
  { label: "Uneasy", value: 2, color: "from-gold-200 to-gold-300", emoji: "🍂" },
  { label: "Anxious", value: 1, color: "from-rose-200 to-rose-300", emoji: "🌧" },
];

const features = [
  {
    title: "AI Companion",
    desc: "A thoughtful conversation partner that listens, understands, and guides you with warmth.",
    href: "/chat",
    gradient: "from-lavender-100 to-lavender-200",
    accent: "text-lavender-500",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
  {
    title: "Mood Journey",
    desc: "Track your emotional landscape with beautiful visualizations and personal insights.",
    href: "/mood",
    gradient: "from-forest-100 to-forest-200",
    accent: "text-forest-600",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
  },
  {
    title: "Journal",
    desc: "Write freely in a space designed for reflection, clarity, and personal growth.",
    href: "/journal",
    gradient: "from-gold-100 to-gold-200",
    accent: "text-gold-500",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    title: "Breathe",
    desc: "Immersive breathing exercises that calm your nervous system and restore balance.",
    href: "/breathe",
    gradient: "from-ocean-100 to-ocean-200",
    accent: "text-ocean-500",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <circle cx="12" cy="12" r="8" strokeDasharray="4 4" opacity="0.5"/>
      </svg>
    ),
  },
];

function HomeContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 60]);

  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setCurrentTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero — Immersive Opening */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Ambient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-cream via-parchment to-cream" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-forest-200/40 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-lavender-200/30 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-ocean-200/20 blur-[120px]"
          />
        </div>

        {/* Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <span className="text-sm font-medium text-stone-400 tracking-widest uppercase">
              {greeting}
            </span>
          </motion.div>
          
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="block text-stone-800">Your mind</span>
            <span className="block mt-1">
              <span className="text-stone-800">deserves </span>
              <span className="bg-gradient-to-r from-forest-500 via-forest-400 to-ocean-400 bg-clip-text text-transparent">
                ease
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-stone-400 font-light max-w-lg mx-auto leading-relaxed mb-12"
          >
            A thoughtful companion for your emotional wellbeing.
            Breathe, reflect, and grow — one moment at a time.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/chat"
              className="group relative px-8 py-4 bg-stone-800 text-warm-white rounded-2xl text-sm font-medium overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin your journey
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </Link>
            <Link
              href="/breathe"
              className="px-8 py-4 text-stone-500 rounded-2xl text-sm font-medium hover:text-stone-700 hover:bg-stone-100/50 transition-all duration-300"
            >
              Take a breath first
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeUp}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 rounded-full border-2 border-stone-200 flex items-start justify-center p-1.5"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Quick Mood Check */}
      <section className="relative py-24 md:py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-sm font-medium text-stone-400 tracking-widest uppercase mb-6">
            Right now
          </h2>
          <p
            className="text-3xl md:text-4xl font-light text-stone-700 mb-12 leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How are you feeling?
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {moodOptions.map((mood, i) => (
              <motion.div
                key={mood.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/mood?initial=${mood.value}`}
                  className={`group flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r ${mood.color} border border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-lg active:scale-95`}
                >
                  <span className="text-lg">{mood.emoji}</span>
                  <span className="text-sm font-medium text-stone-700">{mood.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features — Intentional Reveals */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16 md:mb-20"
          >
            <h2
              className="text-3xl md:text-5xl font-light text-stone-800 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Everything you need to
              <br />
              <span className="text-forest-500">feel more yourself</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={feature.href} className="group block">
                  <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${feature.gradient} p-8 md:p-10 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:scale-[1.01] active:scale-[0.99]`}>
                    <div className={`${feature.accent} mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:translate-x-1`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-stone-800 mb-2 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-stone-500 text-sm md:text-base leading-relaxed max-w-xs">
                      {feature.desc}
                    </p>
                    <div className={`mt-6 flex items-center gap-1.5 text-sm font-medium ${feature.accent} transition-all duration-300 group-hover:gap-3`}>
                      <span>Explore</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Reflection */}
      <section className="py-24 md:py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-800 to-stone-900 p-10 md:p-16 text-warm-white">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-forest-400/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-lavender-400/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <p className="text-sm font-medium text-stone-400 tracking-widest uppercase mb-6">
                Daily Reflection
              </p>
              <blockquote
                className="text-2xl md:text-3xl lg:text-4xl font-light leading-snug mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                &ldquo;Between stimulus and response there is a space.
                In that space is our power to choose.&rdquo;
              </blockquote>
              <p className="text-stone-400 text-sm">— Viktor Frankl</p>
              
              <div className="mt-10">
                <Link
                  href="/journal"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-sm font-medium backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:gap-3"
                >
                  Write your thoughts
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Breathing Preview */}
      <section className="py-16 md:py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg mx-auto text-center"
        >
          <p className="text-sm font-medium text-stone-400 tracking-widest uppercase mb-8">
            Take a moment
          </p>
          
          <Link href="/breathe" className="group block mb-10">
            <div className="relative w-48 h-48 mx-auto">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-ocean-200/40 to-forest-200/40 blur-xl"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-4 rounded-full bg-gradient-to-br from-ocean-200/60 to-forest-200/60 blur-md"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-8 rounded-full bg-gradient-to-br from-ocean-100 to-forest-100 flex items-center justify-center"
              >
                <span className="text-forest-600 font-light text-lg">Breathe</span>
              </motion.div>
            </div>
          </Link>
          
          <p className="text-stone-400 text-sm font-light">
            Tap to begin a guided breathing session
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-stone-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-stone-700" style={{ fontFamily: "'Playfair Display', serif" }}>
              MindEase
            </span>
          </div>
          <p className="text-xs text-stone-300 font-light">
            Designed with care for your mental wellbeing
          </p>
        </div>
      </footer>

      {/* Bottom safe area for mobile nav */}
      <div className="h-24 md:h-0" />
    </main>
  );
}

export default function HomePage() {
  const { ready } = useAuthGuard();

  if (!ready) {
    return <div className="min-h-screen bg-cream" />;
  }

  return <HomeContent />;
}
