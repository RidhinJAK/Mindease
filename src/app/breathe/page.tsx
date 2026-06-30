"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface BreathingTechnique {
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter: number;
  color: string;
  gradient: string;
}

const techniques: BreathingTechnique[] = [
  {
    name: "Calm",
    description: "4-7-8 technique for deep relaxation",
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfter: 0,
    color: "#94B8D4",
    gradient: "from-ocean-200 to-ocean-400",
  },
  {
    name: "Balance",
    description: "Box breathing for focus and balance",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    color: "#9EC5A8",
    gradient: "from-forest-200 to-forest-400",
  },
  {
    name: "Energize",
    description: "Quick breaths to boost energy",
    inhale: 3,
    hold: 1,
    exhale: 3,
    holdAfter: 1,
    color: "#D4C48A",
    gradient: "from-gold-200 to-gold-400",
  },
  {
    name: "Sleep",
    description: "Extended exhale for restful sleep",
    inhale: 4,
    hold: 4,
    exhale: 8,
    holdAfter: 2,
    color: "#C2B3D9",
    gradient: "from-lavender-200 to-lavender-400",
  },
];

type Phase = "idle" | "inhale" | "hold" | "exhale" | "holdAfter";

export default function BreathePage() {
  const { ready } = useAuthGuard();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const timeLeftRef = useRef(0);
  const techniqueRef = useRef<BreathingTechnique | null>(null);

  const phaseLabels: Record<Phase, string> = {
    idle: "Ready",
    inhale: "Breathe in",
    hold: "Hold",
    exhale: "Breathe out",
    holdAfter: "Hold",
  };

  const getNextPhase = useCallback((current: Phase): Phase => {
    const t = techniqueRef.current;
    if (!t) return "idle";
    switch (current) {
      case "inhale": return t.hold > 0 ? "hold" : "exhale";
      case "hold": return "exhale";
      case "exhale": return t.holdAfter > 0 ? "holdAfter" : "inhale";
      case "holdAfter": return "inhale";
      default: return "inhale";
    }
  }, []);

  const getPhaseDuration = useCallback((p: Phase): number => {
    const t = techniqueRef.current;
    if (!t) return 0;
    switch (p) {
      case "inhale": return t.inhale;
      case "hold": return t.hold;
      case "exhale": return t.exhale;
      case "holdAfter": return t.holdAfter;
      default: return 0;
    }
  }, []);

  const startSession = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    techniqueRef.current = technique;
    setIsActive(true);
    setTotalCycles(0);
    setElapsed(0);

    const initialPhase: Phase = "inhale";
    const initialDuration = technique.inhale;
    setPhase(initialPhase);
    phaseRef.current = initialPhase;
    setTimeLeft(initialDuration);
    timeLeftRef.current = initialDuration;

    intervalRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      setElapsed((prev) => prev + 1);

      if (timeLeftRef.current <= 0) {
        const currentPhase = phaseRef.current;
        if (currentPhase === "exhale" || (currentPhase === "holdAfter")) {
          if (currentPhase === "holdAfter" || (currentPhase === "exhale" && (techniqueRef.current?.holdAfter ?? 0) === 0)) {
            setTotalCycles((prev) => prev + 1);
          }
        }

        const nextPhase = getNextPhase(currentPhase);
        const nextDuration = getPhaseDuration(nextPhase);

        if (nextDuration === 0) {
          // Skip zero-duration phases
          const skipPhase = getNextPhase(nextPhase);
          const skipDuration = getPhaseDuration(skipPhase);
          phaseRef.current = skipPhase;
          setPhase(skipPhase);
          timeLeftRef.current = skipDuration;
          setTimeLeft(skipDuration);
        } else {
          phaseRef.current = nextPhase;
          setPhase(nextPhase);
          timeLeftRef.current = nextDuration;
          setTimeLeft(nextDuration);
        }
      }
    }, 1000);
  };

  const stopSession = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setPhase("idle");

    if (elapsed > 5) {
      try {
        await fetch("/api/breathing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            technique: selectedTechnique?.name || "",
            durationSeconds: elapsed,
          }),
        });
      } catch { /* ignore */ }
    }

    setElapsed(0);
    setTotalCycles(0);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getScale = () => {
    switch (phase) {
      case "inhale": return 1.4;
      case "hold": return 1.4;
      case "exhale": return 1;
      case "holdAfter": return 1;
      default: return 1.1;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!ready) {
    return <div className="min-h-screen bg-cream" />;
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      <div className="pt-24 md:pt-32 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!isActive ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              >
                {/* Header */}
                <div className="mb-12">
                  <h1
                    className="text-4xl md:text-5xl font-light text-stone-800 mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Breathe
                  </h1>
                  <p className="text-stone-400 text-base font-light">
                    Choose a technique and find your rhythm
                  </p>
                </div>

                {/* Technique Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {techniques.map((tech, i) => (
                    <motion.button
                      key={tech.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                      onClick={() => startSession(tech)}
                      className={`group text-left bg-gradient-to-br ${tech.gradient} rounded-3xl p-7 md:p-8 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-white/60" />
                        </div>
                        <h3 className="text-lg font-semibold text-stone-700">{tech.name}</h3>
                      </div>
                      <p className="text-sm text-stone-500/80 mb-4 font-light">{tech.description}</p>
                      <div className="flex items-center gap-2 text-xs text-stone-500/60">
                        <span>{tech.inhale}s in</span>
                        <span>·</span>
                        <span>{tech.hold}s hold</span>
                        <span>·</span>
                        <span>{tech.exhale}s out</span>
                        {tech.holdAfter > 0 && (
                          <>
                            <span>·</span>
                            <span>{tech.holdAfter}s hold</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                className="flex flex-col items-center justify-center min-h-[70vh]"
              >
                {/* Ambient background */}
                <div className="fixed inset-0 transition-colors duration-[3000ms]" style={{ backgroundColor: `${selectedTechnique?.color}10` }} />

                {/* Breathing Circle */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 mb-12">
                  {/* Outer glow */}
                  <motion.div
                    animate={{ scale: getScale() * 1.1, opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: getPhaseDuration(phase) || 4, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full blur-3xl"
                    style={{ backgroundColor: selectedTechnique?.color }}
                  />
                  
                  {/* Middle ring */}
                  <motion.div
                    animate={{ scale: getScale() * 1.02 }}
                    transition={{ duration: getPhaseDuration(phase) || 4, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full border-2 border-white/20"
                    style={{ borderColor: `${selectedTechnique?.color}30` }}
                  />

                  {/* Main circle */}
                  <motion.div
                    animate={{ scale: getScale() }}
                    transition={{ duration: getPhaseDuration(phase) || 4, ease: "easeInOut" }}
                    className="absolute inset-8 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${selectedTechnique?.color}40, ${selectedTechnique?.color}15)`,
                    }}
                  >
                    <div className="text-center">
                      <motion.p
                        key={phase}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl md:text-2xl font-light text-stone-700 mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {phaseLabels[phase]}
                      </motion.p>
                      <p className="text-3xl font-light text-stone-500">{timeLeft}</p>
                    </div>
                  </motion.div>

                  {/* Particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: phase === "inhale" ? [0.5, 1] : phase === "exhale" ? [1, 0.5] : 1,
                        opacity: [0.2, 0.5, 0.2],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: getPhaseDuration(phase) || 4,
                        ease: "easeInOut",
                        rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                      }}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: selectedTechnique?.color,
                        top: `${20 + Math.sin(i * 1.047) * 35}%`,
                        left: `${50 + Math.cos(i * 1.047) * 40}%`,
                        opacity: 0.3,
                      }}
                    />
                  ))}
                </div>

                {/* Stats */}
                <div className="relative z-10 flex items-center gap-8 text-center mb-10">
                  <div>
                    <p className="text-2xl font-light text-stone-700">{totalCycles}</p>
                    <p className="text-xs text-stone-400 mt-0.5">cycles</p>
                  </div>
                  <div className="w-px h-8 bg-stone-200" />
                  <div>
                    <p className="text-2xl font-light text-stone-700">{formatTime(elapsed)}</p>
                    <p className="text-xs text-stone-400 mt-0.5">elapsed</p>
                  </div>
                </div>

                {/* Stop Button */}
                <button
                  onClick={stopSession}
                  className="relative z-10 px-8 py-4 rounded-2xl bg-warm-white border border-stone-100 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:shadow-md transition-all duration-300 active:scale-95"
                >
                  End session
                </button>

                {/* Technique Name */}
                <p className="relative z-10 text-xs text-stone-300 mt-6">
                  {selectedTechnique?.name} — {selectedTechnique?.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-24 md:h-0" />
    </main>
  );
}
