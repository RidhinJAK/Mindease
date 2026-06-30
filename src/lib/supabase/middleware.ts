import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip if Supabase is not configured — app falls back to localStorage auth
  if (!url || !key) {
    return NextResponse.next({ request });
  }

  const cleanUrl = url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(cleanUrl, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ["/home", "/chat", "/mood", "/journal", "/breathe", "/profile"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-in users away from auth pages
  const authPaths = ["/login", "/signup", "/onboarding"];
  const isAuthPage = authPaths.some(
    (path) => request.nextUrl.pathname === path
  );

  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/home";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
