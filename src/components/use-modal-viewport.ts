"use client";

import { useEffect } from "react";

/** Open modals; the page is locked while any is open, so stacked modals don't unlock each other. */
let openCount = 0;

/**
 * Locks page scrolling while a modal is open and, when the last modal closes, undoes any zoom
 * left behind on mobile browsers. A zoomed visual viewport pushes `position: fixed` bars (the
 * bottom nav) behind the browser's address bar.
 */
export function useModalViewport(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    if (openCount++ === 0) {
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (--openCount > 0) return;
      root.style.overflow = "";
      document.body.style.overflow = "";
      resetZoom();
    };
  }, [open]);
}

/**
 * iOS Safari keeps the zoom from a double-tap or a focused small input after the modal is gone.
 * Briefly capping the viewport scale snaps it back to 1; the original tag is restored right after,
 * so pinch-to-zoom keeps working.
 */
function resetZoom() {
  const scale = window.visualViewport?.scale ?? 1;
  if (scale <= 1.01) return;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) return;
  const original = meta.content;
  meta.content = `${original}, maximum-scale=1`;
  window.setTimeout(() => {
    meta.content = original;
  }, 300);
}
