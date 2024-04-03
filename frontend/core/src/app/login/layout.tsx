import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { Metadata } from "next";
import AuthContainer from "@/components/auth";

export const metadata: Metadata = {
  title: "Turvo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContainer isPublic>
      <html lang="ja">
        <body className={inter.className}>{children}</body>
      </html>
    </AuthContainer>
  );
}

export const dynamic = "error";
