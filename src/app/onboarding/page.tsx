"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { markOnboarded } from "@/lib/auth";

const slides = [
  {
    id: 1,
    headline: "Welcome to\nMindEase",
    subheadline: "Your calm companion for a more mindful life.",
    visual: "welcome",
  },
  {
    id: 2,
    headline: "AI that\nunderstands\nemotions",
    subheadline: "A thoughtful conversation partner who listens, reflects, and walks alongside you.",
    visual: "ai",
  },
  {
    id: 3,
    headline: "Journal\nyour thoughts",
    subheadline: "A beautiful space for reflection, growth, and capturing the moments that matter.",
    visual: "journal",
  },
  {
    id: 4,
    headline: "Track\nyour mood",
    subheadline: "Discover patterns, gain insights, and celebrate your emotional journey.",
    visual: "mood",
  },
  {
    id: 5,
    headline: "Daily habits\nand reflections",
    subheadline: "Build meaningful routines that nurture your wellbeing, one day at a time.",
    visual: "habits",
  },
  {
    id: 6,
    headline: "Privacy\ncomes first",
    subheadline: "Your thoughts are yours alone. We never share, sell, or compromise your data.",
    visual: "privacy",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      markOnboarded();
      router.push("/signup");
    }
  };

  const handleSkip = () => {
    markOnboarded();
    router.push("/signup");
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 overflow-hidden bg-cream">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <motion.div
          key={`bg-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slide.visual === "welcome" && (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-forest-200/50 blur-[140px]"
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-lavender-200/40 blur-[130px]"
              />
            </>
          )}
          {slide.visual === "ai" && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lavender-200/40 blur-[160px]"
            />
          )}
          {slide.visual === "journal" && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-200/40 blur-[160px]"
            />
          )}
          {slide.visual === "mood" && (
            <>
              <motion.div
                animate={{ x: [-50, 50, -50], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-forest-200/40 blur-[140px]"
              />
              <motion.div
                animate={{ x: [50, -50, 50], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-ocean-200/40 blur-[140px]"
              />
            </>
          )}
          {slide.visual === "habits" && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ocean-200/40 blur-[160px]"
            />
          )}
          {slide.visual === "privacy" && (
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-stone-200/30 blur-[160px]"
            />
          )}
        </motion.div>
      </div>

      {/* Skip button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={handleSkip}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-stone-600 hover:bg-stone-100/50 transition-all duration-300"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Visual area */}
        <div className="flex-1 flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative"
            >
              {/* Visual illustrations */}
              {slide.visual === "welcome" && (
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-forest-300/30"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-8 rounded-full bg-gradient-to-br from-forest-300/60 to-forest-500/60 backdrop-blur-xl flex items-center justify-center"
                  >
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z" />
                      <path d="M12 14v-4" />
                    </svg>
                  </motion.div>
                </div>
              )}
              {slide.visual === "ai" && (
                <div className="relative flex gap-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                      className="w-16 h-20 rounded-2xl bg-gradient-to-br from-lavender-200 to-lavender-300 backdrop-blur-xl flex items-center justify-center shadow-lg"
                    >
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                        className="w-6 h-6 rounded-full bg-white/60"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
              {slide.visual === "journal" && (
                <motion.div
                  initial={{ rotateY: -20 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                  className="w-48 h-64 md:w-56 md:h-72 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 shadow-2xl p-6 flex flex-col gap-3"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0 }}
                      animate={{ width: `${60 + Math.random() * 40}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: [0.22, 1, 0.36, 1] as const }}
                      className="h-2 rounded-full bg-stone-300/40"
                    />
                  ))}
                </motion.div>
              )}
              {slide.visual === "mood" && (
                <div className="flex items-end gap-3">
                  {[1, 2, 3, 4, 5].map((v, i) => {
                    const colors = ["#D4AEAE", "#D4C48A", "#B8B0A5", "#94B8D4", "#9EC5A8"];
                    return (
                      <motion.div
                        key={v}
                        initial={{ height: 0 }}
                        animate={{ height: `${30 + v * 14}px` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                        className="w-10 md:w-12 rounded-xl"
                        style={{ backgroundColor: colors[i] }}
                      />
                    );
                  })}
                </div>
              )}
              {slide.visual === "habits" && (
                <div className="flex flex-col gap-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] as const }}
                      className="w-64 h-14 rounded-2xl bg-gradient-to-r from-ocean-100 to-ocean-200 backdrop-blur-xl flex items-center px-4 gap-3 shadow-lg"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                        className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ocean-500">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 rounded-full bg-stone-300/30 w-3/4" />
                        <div className="h-1.5 rounded-full bg-stone-300/20 w-1/2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {slide.visual === "privacy" && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-stone-700 to-stone-800 shadow-2xl flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotateY: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text + CTA area */}
        <div className="relative px-8 pb-12 md:pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="text-center max-w-md mx-auto"
            >
              <h1
                className="text-4xl md:text-5xl font-light text-stone-800 mb-4 leading-tight whitespace-pre-line"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {slide.headline}
              </h1>
              <p className="text-base md:text-lg text-stone-400 font-light leading-relaxed mb-10">
                {slide.subheadline}
              </p>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {slides.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === currentSlide ? 24 : 8,
                      backgroundColor: i === currentSlide ? "#4A8E5C" : "#D4CEC7",
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                    className="h-2 rounded-full"
                  />
                ))}
              </div>

              {/* Continue button */}
              <button
                onClick={handleNext}
                className="w-full max-w-xs mx-auto py-4 rounded-2xl bg-stone-800 text-warm-white text-sm font-medium hover:bg-stone-700 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
              >
                {currentSlide === slides.length - 1 ? "Let's begin" : "Continue"}
              </button>

              {currentSlide === 0 && (
                <p className="mt-6 text-xs text-stone-300">
                  Already have an account?{" "}
                  <Link href="/login" className="text-stone-500 hover:text-stone-700 underline underline-offset-2">
                    Log in
                  </Link>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
