import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "掌柜AI - 你的AI掌柜团队",
  description: "AI原生的中小企业经营管理平台，让AI帮你把生意做得更好",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeInitScript = `
    (function() {
      try {
        var stored = localStorage.getItem("theme-mode") || "system";
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var resolved = stored === "system" ? (prefersDark ? "dark" : "light") : stored;
        document.documentElement.dataset.themeMode = stored;
        document.documentElement.dataset.theme = resolved;
        document.documentElement.style.colorScheme = resolved;
      } catch (error) {
        document.documentElement.dataset.themeMode = "system";
        document.documentElement.dataset.theme = "dark";
        document.documentElement.style.colorScheme = "dark";
      }
    })();
  `;

  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body antialiased app-body">{children}</body>
    </html>
  );
}
