import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ---- Maintenance mode check ----
  const path = request.nextUrl.pathname;
  const alwaysAllowed =
    path === "/maintenance" ||
    path.startsWith("/admin") ||
    path === "/login" ||
    path.startsWith("/_next") ||
    path.startsWith("/api");

  if (!alwaysAllowed) {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("maintenance_mode")
      .single();

    if (settings?.maintenance_mode) {
      let isAdmin = false;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        isAdmin = !!profile?.is_admin;
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
