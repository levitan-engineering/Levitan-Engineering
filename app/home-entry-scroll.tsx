"use client";
import { useEffect } from "react";

export default function HomeEntryScroll() {
  useEffect(() => {
    const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    // Preserve explicit section links and the browser's back/forward position.
    if (window.location.hash || entry?.type === "back_forward") return;
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const reset = () => {
      if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
    reset();
    const frame = requestAnimationFrame(reset);
    const onPageShow = (event: PageTransitionEvent) => { if (!event.persisted) reset(); };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", onPageShow);
      history.scrollRestoration = previous;
    };
  }, []);
  return null;
}
