import type { Metadata } from "next";
import Head from "next/head";
import Body from "@/components/shared/content";

export const metadata: Metadata = {
  title: "Turvo",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <Head>
        <title>Turvo | Main</title>
      </Head>
      <Body>{children}</Body>
    </html>
  );
}

export const dynamic = "error";
