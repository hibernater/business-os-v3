"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

const THEME_OPTIONS: Array<{
  mode: ThemeMode;
  label: string;
  icon: string;
}> = [
  { mode: "light", label: "浅色", icon: "☀" },
  { mode: "dark", label: "深色", icon: "☾" },
  { mode: "system", label: "自动", icon: "◐" },
];

function applyTheme(mode: ThemeMode) {
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "system" ? (prefersDark ? "dark" : "light") : mode;

  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export default function ThemeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored =
      (window.localStorage.getItem("theme-mode") as ThemeMode | null) || "system";
    setThemeMode(stored);
    applyTheme(stored);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current =
        (window.localStorage.getItem("theme-mode") as ThemeMode | null) ||
        "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const updateTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    window.localStorage.setItem("theme-mode", mode);
    applyTheme(mode);
  };

  return (
    <div className="theme-switcher hidden md:flex items-center gap-1 p-1 rounded-2xl">
      {THEME_OPTIONS.map((option) => {
        const active = option.mode === themeMode;
        return (
          <button
            key={option.mode}
            type="button"
            onClick={() => updateTheme(option.mode)}
            className={`theme-switcher-button ${active ? "is-active" : ""}`}
            aria-pressed={active}
            title={option.label}
          >
            <span className="theme-switcher-icon" aria-hidden="true">
              {option.icon}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
