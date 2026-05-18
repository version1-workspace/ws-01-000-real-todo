import { Metadata } from "next";
import { ToastContainer } from "@/lib/toast";

export const metadata: Metadata = {
  title: "Turvo(Dev) | UI Catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastContainer config={{ maxCount: 5, position: "topRight" }}>
      {children}
    </ToastContainer>
  );
}

export const dynamic = "error";
