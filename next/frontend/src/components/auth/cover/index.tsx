import styles from "./index.module.css";
import Button from "@/components/shared/button";

interface Props {
  onSwitch?: () => void;
}

export function Login({ onSwitch }: Props) {
  return (
    <div className={styles.form}>
      <div className={styles.copy}>
        <h2 className={styles.copyText}>Welcome Back!</h2>
      </div>
      <div className={styles.description}>
        Turvo にサインして、Todo 管理を始めよう
      </div>
      <div className={styles.action}>
        <Button
          className={styles.signUpButton}
          variant="secondary"
          onClick={onSwitch}>
          サインイン
        </Button>
      </div>
    </div>
  );
}

export function SignUp({ onSwitch }: Props) {
  return (
    <div className={styles.form}>
      <div className={styles.copy}>
        <h2 className={styles.copyText}>Hello, Friend!</h2>
      </div>
      <div className={styles.description}>
        メールアドレスを登録して Turvo を始めよう
      </div>
      <div className={styles.action}>
        <Button
          className={styles.signUpButton}
          variant="secondary"
          onClick={onSwitch}>
          新規登録
        </Button>
      </div>
    </div>
  );
}
