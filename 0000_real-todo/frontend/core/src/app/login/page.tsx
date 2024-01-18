import { Metadata } from "next";
import styles from "./page.module.css";
import { ToastContainer } from "@/lib/toast";
import { position } from "@/lib/toast/config";
import Content from "./content";

export const metadata: Metadata = {
  title: "Turbo | ログイン",
};

export default function Login() {
  return (
    <main className={styles.main}>
      <ToastContainer config={{ position: position.BOTTOM_LEFT }}>
        <Content />
      </ToastContainer>
    </main>
  );
}
