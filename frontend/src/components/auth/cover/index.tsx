import Button from "@/components/shared/button"
import Icon from "@/components/shared/icon"
import styles from "./index.module.css"

interface Props {
  onSwitch?: () => void
}

export function Login({ onSwitch }: Props) {
  return (
    <div className={styles.signInContainer}>
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
            onClick={onSwitch}
          >
            サインイン
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SignUp({ onSwitch }: Props) {
  return (
    <div className={styles.signUpContainer}>
      <div className={styles.form}>
        <div className={styles.icon}>
          <div className={styles.iconCircle}>
            <Icon name="paperPlane" size={32} color="#42b883" />
          </div>
        </div>
        <div className={styles.copy}>
          <h2 className={styles.copyText}>
            Hello, <span className={styles.hilightText}>Friend!</span>
          </h2>
        </div>
        <div className={styles.description}>
          メールアドレスを登録して
          <br />
          Turvo を始めよう
        </div>
        <div className={styles.action}>
          <Button
            className={styles.signUpButton}
            variant="secondary"
            onClick={onSwitch}
          >
            新規登録
          </Button>
        </div>
      </div>
    </div>
  )
}
