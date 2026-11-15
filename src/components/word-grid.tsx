"use client";

import { useState } from "react";
import type { ItemWithStatus } from "@/lib/queries";
import { WordCard } from "./word-card";

/**
 * Grid of word cards that keeps its order while the user marks items learned or not.
 *
 * Every Server Action calls refresh(), which re-renders the page with a new item list. A card
 * whose status changed can then leave the list (e.g. the "Chưa học" filter in the library) or
 * new cards can arrive. Cards already on screen keep their slot, and get fresh data when the
 * server still returns them; new cards are appended at the end. Give the grid a `key` that
 * changes with the filter or page, so a real navigation starts from the server order again.
 */
export function WordGrid({
  items,
  today,
  speech,
  empty = null,
}: {
  items: ItemWithStatus[];
  today: string;
  speech: string;
  /** Shown only when nothing has been on screen, so the last card never vanishes into an empty state. */
  empty?: React.ReactNode;
}) {
  const [view, setView] = useState({ source: items, list: items });

  let list = view.list;
  if (view.source !== items) {
    const fresh = new Map(items.map((i) => [i.id, i]));
    const shown = new Set(view.list.map((i) => i.id));
    list = [...view.list.map((i) => fresh.get(i.id) ?? i), ...items.filter((i) => !shown.has(i.id))];
    setView({ source: items, list });
  }

  if (list.length === 0) return empty;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {list.map((item) => (
        <WordCard key={item.id} item={item} today={today} speech={speech} />
      ))}
    </div>
  );
}
