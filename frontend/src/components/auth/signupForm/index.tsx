import Button from "@/components/shared/button"
import Icon from "@/components/shared/icon"
import Input from "@/components/shared/input/text"
import { useToast } from "@/lib/toast/hook"
import styles from "./index.module.css"

export default function SignUpForm() {
  const toast = useToast()
  return (
    <div className={styles.form}>
      <div className={styles.copy}>
        <h2 className={styles.copyText}>
          Hello, <span className={styles.hilightText}>Friend!</span>
        </h2>
      </div>
      <div className={styles.description}>
        メールアドレスを登録して Turvo を始めよう
      </div>
      <div className={styles.field}>
        <Input
          icon={<Icon name="mail" size={20} color="#4b4c4d" />}
          value=""
          placeholder="turbo@example.com"
          onChange={() => {
            toast.info(
              "Turvo は学習用アプリです。新規登録は受け付けていません。",
            )
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
            )
          }}
        >
          新規登録
        </Button>
      </div>
    </div>
  )
}
