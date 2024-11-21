import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turvo",
  description: `Turbo は目標達成をサポートするシンプルな TODO アプリです。様々な角度から練られた鮮明なゴール設定、精緻な計画を助けます。
  ※Turvo は学習用のサンプルアプリです。 詳細 https://github.com/version1-workspace/ws-01-000-real-todo`,
  metadataBase: new URL("https://version1-real-todo.netlify.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

export const dynamic = "error";
