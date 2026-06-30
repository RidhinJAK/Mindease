"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle, signInWithApple, resetPassword } from "@/lib/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(authError === "auth_failed" ? "Authentication failed. Please try again." : "");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    const result = await signInWithEmail({ email, password });

    if (result.success) {
      router.push("/home");
    } else {
      setError(result.error || "Login failed");
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setSubmitting(true);
    const result = await resetPassword(email);
    
    if (result.success) {
      setResetSent(true);
    } else {
      setError(result.error || "Could not send reset email");
    }
    setSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const handleAppleLogin = async () => {
    const result = await signInWithApple();
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  if (resetSent) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-forest-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest-600">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1
            className="text-2xl font-light text-stone-800 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Check your email
          </h1>
          <p className="text-stone-400 text-sm mb-6">
            We&apos;ve sent a password reset link to <strong className="text-stone-600">{email}</strong>
          </p>
          <button
            onClick={() => {
              setShowResetForm(false);
              setResetSent(false);
            }}
            className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-2"
          >
            Back to login
          </button>
        </motion.div>
      </div>
    );
  }

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden px-6 py-12">
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
          className="relative w-full max-w-md z-10"
        >
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-light text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Reset password
            </h1>
            <p className="text-stone-400 text-sm font-light">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="bg-warm-white border-2 border-stone-100 rounded-2xl overflow-hidden focus-within:border-forest-300 focus-within:shadow-[0_0_0_4px_rgba(158,197,168,0.1)] transition-all duration-300">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
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
              className="w-full py-4 rounded-2xl bg-stone-800 text-warm-white text-sm font-medium hover:bg-stone-700 hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send reset link"}
            </button>

            <button
              type="button"
              onClick={() => setShowResetForm(false)}
              className="w-full py-3 text-sm text-stone-500 hover:text-stone-700"
            >
              Back to login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden px-6 py-12">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-forest-200/40 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2], x: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-200/30 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-lavender-200/20 blur-[160px]"
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

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-light text-stone-800 mb-3 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome
            <br />
            back
          </h1>
          <p className="text-stone-400 text-sm font-light">
            Continue your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <motion.div
            animate={{
              borderColor: focused === "email" ? "#9EC5A8" : "#E8E4DF",
              boxShadow: focused === "email" ? "0 0 0 4px rgba(158, 197, 168, 0.1)" : "0 0 0 0px transparent",
            }}
            transition={{ duration: 0.3 }}
            className="bg-warm-white border-2 rounded-2xl overflow-hidden"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="Email address"
              className="w-full px-5 py-4 bg-transparent text-[15px] text-stone-700 placeholder:text-stone-300 outline-none"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            animate={{
              borderColor: focused === "password" ? "#9EC5A8" : "#E8E4DF",
              boxShadow: focused === "password" ? "0 0 0 4px rgba(158, 197, 168, 0.1)" : "0 0 0 0px transparent",
            }}
            transition={{ duration: 0.3 }}
            className="bg-warm-white border-2 rounded-2xl overflow-hidden"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="Password"
              className="w-full px-5 py-4 bg-transparent text-[15px] text-stone-700 placeholder:text-stone-300 outline-none"
            />
          </motion.div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                  rememberMe ? "bg-forest-500 border-forest-500" : "border-stone-200 bg-warm-white"
                }`}
              >
                {rememberMe && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </div>
              <span className="text-sm text-stone-500">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowResetForm(true)}
              className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-2"
            >
              Forgot?
            </button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                className="bg-rose-100 text-rose-700 text-sm px-4 py-3 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-stone-800 text-warm-white text-sm font-medium hover:bg-stone-700 hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {submitting ? "Signing in..." : "Log in"}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-cream px-4 text-stone-300">or continue with</span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAppleLogin}
              className="py-3.5 rounded-2xl bg-stone-800 text-warm-white text-sm font-medium hover:bg-stone-700 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01M12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Apple
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="py-3.5 rounded-2xl bg-warm-white border border-stone-100 text-sm font-medium text-stone-600 hover:border-stone-200 hover:shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-stone-400 pt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-stone-600 hover:text-stone-800 font-medium underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <LoginContent />
    </Suspense>
  );
}
