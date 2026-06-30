/**
 * Authentication utilities for MindEase
 * Uses Supabase when configured, falls back to localStorage for development
 */

import { createClient } from "@/lib/supabase/client";

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ============================================
// SUPABASE AUTH (Production)
// ============================================

export async function signUpWithEmail(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return signupLocal(data);
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.name,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signInWithEmail(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return loginLocal(data);
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signInWithApple(): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase not configured" };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) {
    logoutLocal();
    return;
  }

  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getUser() {
  if (!isSupabaseConfigured()) {
    return getCurrentUserLocal();
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
  };
}

export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Password reset not available in demo mode" };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// LOCAL AUTH (Development fallback)
// ============================================

interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface LocalSession {
  userId: string;
  email: string;
  name: string;
  loggedInAt: string;
}

const USERS_KEY = "mindease_users";
const SESSION_KEY = "mindease_session";
const ONBOARDED_KEY = "mindease_onboarded";

function getLocalUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveLocalUsers(users: LocalUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getLocalSession(): LocalSession | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

function signupLocal(data: { name: string; email: string; password: string }): { success: boolean; error?: string } {
  const users = getLocalUsers();

  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: "Email already registered" };
  }

  const newUser: LocalUser = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  const session: LocalSession = {
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true };
}

function loginLocal(data: { email: string; password: string }): { success: boolean; error?: string } {
  const users = getLocalUsers();
  const user = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());

  if (!user) {
    return { success: false, error: "No account found with this email" };
  }

  if (user.password !== data.password) {
    return { success: false, error: "Incorrect password" };
  }

  const session: LocalSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true };
}

function logoutLocal() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

function getCurrentUserLocal(): { id: string; email: string; name: string } | null {
  const session = getLocalSession();
  if (!session) return null;
  return { id: session.userId, email: session.email, name: session.name };
}

// ============================================
// ONBOARDING STATE
// ============================================

export function hasOnboarded(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDED_KEY) === "true";
}

export function markOnboarded() {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDED_KEY, "true");
}

export function isLoggedIn(): boolean {
  if (!isSupabaseConfigured()) {
    return getLocalSession() !== null;
  }
  // For Supabase, we check synchronously via cookie existence
  // Real check happens in middleware
  if (typeof window === "undefined") return false;
  return document.cookie.includes("sb-");
}

// Legacy exports for backward compatibility
export const signup = signupLocal;
export const login = loginLocal;
export const logout = logoutLocal;
export const getCurrentUser = getCurrentUserLocal;
