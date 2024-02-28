"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Header from "@/components/shared/header/public";
import Footer from "@/components/shared/footer";
import Input from "@/components/shared/input/text";
import Button from "@/components/shared/button";
import LoginForm from "@/components/auth/loginForm";
import { useToast } from "@/lib/toast/hook";

const Content = () => {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      if (!rendered && error === "loginRequired") {
        toast.error("ログインが必要です");
      }
    }
    setRendered(true);
  }, [searchParams, toast, rendered]);

  return (
    <>
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
    </>
  );
};

export default Content;
