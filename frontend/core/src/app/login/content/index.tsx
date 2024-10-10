"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Header from "@/components/shared/header/public";
import Footer from "@/components/shared/footer";
import Input from "@/components/shared/input/text";
import Button from "@/components/shared/button";
import LoginForm from "@/components/auth/loginForm";
import { useToast } from "@/lib/toast/hook";

interface Props {
  light?: boolean;
}

const Content = ({ light }: Props) => {
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
      <Header light={light} />
      <section className={styles.content}>
        <div className={styles.card}>
          <div className={styles.left}>
            <div className={styles.whiteBar} style={{ top: '40px' }}></div>
            <div className={styles.form}>
              <div className={styles.copy}>
                Enjoy your life with Turvo 🎉🎉🎉
              </div>
              <h2 className={styles.formTitle}>
                Sign Up
                <span className={styles.formSubtitle}>無料で始める</span>
              </h2>
              <div className={styles.field}>
                <Input type="text" value="" placeholder="turbo@example.com" />
              </div>
              <div className={styles.field}>
                <Button variant="secondary">新規登録</Button>
              </div>
            </div>
            <div className={styles.whiteBar}></div>
          </div>
          <div className={styles.border}></div>
          <div className={styles.right}>
            <div className={styles.greenBar} style={{ top: '40px' }}></div>
            <LoginForm />
            <div className={styles.greenBar}></div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Content;
