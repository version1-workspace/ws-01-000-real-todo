import { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import { ToastContainer } from "@/lib/toast";
import { position } from "@/lib/toast/config";
import Content from "./content";

export const metadata: Metadata = {
  title: "Turbo | ログイン",
};

const inter = Inter({ subsets: ["latin"] });

export default function Login() {
  return (
    <main className={styles.main}>
      <ToastContainer config={{ position: position.TOP }}>
        <Content />
      </ToastContainer>
    </main>
  );
}
