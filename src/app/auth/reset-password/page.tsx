"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/home"), 2000);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-forest-200/40 blur-[140px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8 6 6 10 6 14a6 6 0 0 0 12 0c0-4-2-8-6-12z" />
              <path d="M12 14v-4" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-stone-700 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            MindEase
          </span>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-forest-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-forest-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-stone-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Password updated!
            </h1>
            <p className="text-stone-400 text-sm">Redirecting you now...</p>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1
                className="text-4xl font-light text-stone-800 mb-3 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                New password
              </h1>
              <p className="text-stone-400 text-sm font-light">
                Choose a new secure password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-warm-white border-2 border-stone-100 rounded-2xl overflow-hidden focus-within:border-forest-300 focus-within:shadow-[0_0_0_4px_rgba(158,197,168,0.1)] transition-all duration-300">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-5 py-4 bg-transparent text-[15px] text-stone-700 placeholder:text-stone-300 outline-none"
                />
              </div>

              <div className="bg-warm-white border-2 border-stone-100 rounded-2xl overflow-hidden focus-within:border-forest-300 focus-within:shadow-[0_0_0_4px_rgba(158,197,168,0.1)] transition-all duration-300">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-5 py-4 bg-transparent text-[15px] text-stone-700 placeholder:text-stone-300 outline-none"
                />
              </div>

              {error && (
                <div className="bg-rose-100 text-rose-700 text-sm px-4 py-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-stone-800 text-warm-white text-sm font-medium hover:bg-stone-700 hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 mt-4"
              >
                {submitting ? "Updating..." : "Update password"}
              </button>

              <p className="text-center text-xs text-stone-400 pt-2">
                <Link href="/login" className="text-stone-600 hover:text-stone-800 underline underline-offset-2">
                  Back to login
                </Link>
              </p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
