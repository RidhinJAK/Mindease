import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file."
    );
  }

  // Clean the URL — remove trailing slashes and any path like /rest/v1/
  const cleanUrl = url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  return createBrowserClient(cleanUrl, key);
}
