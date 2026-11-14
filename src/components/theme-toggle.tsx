"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

type Mode = "system" | "light" | "dark";
const EVENT = "themechange";

function read(): Mode {
  try {
    return (localStorage.getItem("theme") as Mode) || "system";
  } catch {
    return "system";
  }
}

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const LABEL: Record<Mode, string> = { system: "Theo hệ thống", light: "Sáng", dark: "Tối" };
const ORDER: Mode[] = ["system", "light", "dark"];

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const mode = useSyncExternalStore(subscribe, read, () => "system" as Mode);

  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => read() === "system" && apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    try {
      localStorage.setItem("theme", next);
    } catch {}
    apply(next);
    window.dispatchEvent(new Event(EVENT));
  };

  const Icon = mode === "dark" ? Moon : mode === "light" ? Sun : Monitor;
  return (
    <button
      type="button"
      onClick={cycle}
      className={`btn btn-sm ${withLabel ? "" : "btn-icon"}`}
      aria-label={`Giao diện: ${LABEL[mode]}`}
      title={`Giao diện: ${LABEL[mode]}`}
    >
      <Icon size={16} />
      {withLabel && <span>{LABEL[mode]}</span>}
    </button>
  );
}
