"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { isLoggedIn, hasOnboarded } from "@/lib/auth";

export default function SplashScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  useEffect(() => {
    // Phase transitions
    const textTimer = setTimeout(() => setPhase("text"), 900);
    const exitTimer = setTimeout(() => setPhase("exit"), 2800);
    const navigateTimer = setTimeout(() => {
      // Decide where to route based on state
      if (isLoggedIn()) {
        router.replace("/home");
      } else if (hasOnboarded()) {
        router.replace("/signup");
      } else {
        router.replace("/onboarding");
      }
    }, 3400);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(navigateTimer);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-cream">
      {/* Ambient background orbs */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-forest-200/40 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-lavender-200/30 blur-[110px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-ocean-200/20 blur-[140px]"
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center">
        <AnimatePresence>
          {phase !== "exit" && (
            <motion.div
              key="content"
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              className="flex flex-col items-center"
            >
              {/* Logo mark */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1] as const,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                }}
                className="relative mb-8"
              >
                {/* Outer glow ring */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-3xl bg-forest-300/40 blur-2xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -inset-3 rounded-3xl bg-lavender-300/30 blur-xl"
                />
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-forest-400 via-forest-500 to-forest-600 flex items-center justify-center shadow-[0_10px_40px_rgba(74,142,92,0.3)]">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M12 14v-4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 1.5, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Wordmark */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                className="mb-3"
              >
                <h1
                  className="text-4xl md:text-5xl font-semibold text-stone-800 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  MindEase
                </h1>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
                className="text-sm md:text-base text-stone-400 font-light tracking-wide"
              >
                A space to breathe
              </motion.p>

              {/* Loading dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
                className="mt-16 flex items-center gap-2"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0], opacity: [0.3, 0.9, 0.3] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-forest-400"
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
