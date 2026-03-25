"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "工作台", icon: "🎮" },
  { href: "/skills", label: "技能管理", icon: "⚡" },
  { href: "/workflows", label: "工作流", icon: "🔄" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black shadow-lg shadow-amber-500/20">
            掌
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-display font-bold theme-text-primary leading-none tracking-tight">
              掌柜<span className="text-amber-400">AI</span>
            </h1>
            <p className="text-[9px] theme-text-tertiary leading-none mt-0.5 tracking-[0.15em] font-mono uppercase">
              Business OS
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 theme-soft-surface rounded-xl p-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-amber-500/12 text-amber-500 shadow-sm"
                    : "theme-nav-link"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden lg:flex items-center gap-2 text-xs theme-text-secondary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span>系统运行中</span>
          </div>
          <div className="w-8 h-8 rounded-xl theme-soft-surface flex items-center justify-center text-[10px] font-medium theme-text-secondary">
            老板
          </div>
        </div>
      </div>
    </header>
  );
}
