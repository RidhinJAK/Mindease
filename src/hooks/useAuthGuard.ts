"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

/**
 * Hook to protect routes. Redirects to /login if not authenticated.
 * Returns `ready: true` once auth state is confirmed.
 */
export function useAuthGuard(): { ready: boolean } {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  return { ready };
}
