import { Metadata } from "next";
import Header from "@/components/common/header/public";
import styles from "./page.module.css";
import Footer from "@/components/common/footer";
import Input from "@/components/common/textInput";
import Button from "@/components/common/button";
import LoginForm from "@/components/auth/loginForm";
import { ToastContainer } from "@/lib/toast";
import { position } from "@/lib/toast/config";

export const metadata: Metadata = {
  title: "Turbo | ログイン",
};

export default function Login() {
  return (
    <main className={styles.main}>
      <ToastContainer config={{ position: position.TOP }}>
        <Header />
        <section className={styles.content}>
          <div className={styles.left}>
            <div className={styles.card}>
              <LoginForm />
            </div>
          </div>
          <div className={styles.border}></div>
          <div className={styles.right}>
            <div className={styles.card}>
              <div className={styles.form}>
                <h2 className={styles.formTitle}>新規登録</h2>
                <div className={styles.field}>
                  <Input type="text" value="" placeholder="turbo@example.com" />
                </div>
                <div className={styles.field}>
                  <Button variant="primary">新規登録</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </ToastContainer>
    </main>
  );
}
