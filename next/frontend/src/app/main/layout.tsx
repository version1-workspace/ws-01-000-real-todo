import type { Metadata } from "next"
import Body from "@/components/shared/content"

export const metadata: Metadata = {
  title: "Turvo",
  description: "Turbo は目標達成をサポートするシンプルな TODO アプリです。様々な角度から練られた鮮明なゴール設定、精緻な計画を助けます。",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Body>{children}</Body>
}

export const dynamic = "error"
