"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function getSessionId(): string {
  const key = "kajkoro_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    let sessionId = "";
    try {
      sessionId = getSessionId();
    } catch {
      // sessionStorage unavailable (e.g. private browsing edge cases) — skip session grouping
    }

    supabase
      .from("page_views")
      .insert({
        path: pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        session_id: sessionId || null,
      })
      .then(() => {});
  }, [pathname]);

  return null;
}
