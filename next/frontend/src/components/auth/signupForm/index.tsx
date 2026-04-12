import styles from "./index.module.css";
import Button from "@/components/shared/button";
import Input from "@/components/shared/input/text";
import { useToast } from "@/lib/toast/hook";

export default function SignUpForm() {
  const toast = useToast();
  return (
    <div className={styles.form}>
      <div className={styles.copy}>
        <h2 className={styles.copyText}>Hello, Friend!</h2>
      </div>
      <div className={styles.description}>
        メールアドレスを登録して Turvo を始めよう
      </div>
      <div className={styles.field}>
        <Input
          value=""
          placeholder="turbo@example.com"
          inputClassName={styles.input}
          onChange={() => {
            toast.info(
              "Turvo は学習用アプリです。新規登録は受け付けていません。",
            );
          }}
        />
      </div>
      <div className={styles.action}>
        <Button
          className={styles.signUpButton}
          variant="primary"
          onClick={() => {
            toast.info(
              "Turvo は学習用アプリです。新規登録は受け付けていません。",
            );
          }}>
          新規登録
        </Button>
      </div>
    </div>
  );
}
