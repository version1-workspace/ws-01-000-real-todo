import { Metadata } from "next"
import AuthContainer from "@/components/auth"

export const metadata: Metadata = {
  title: "Turvo",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthContainer isPublic>{children}</AuthContainer>
}

export const dynamic = "error"
