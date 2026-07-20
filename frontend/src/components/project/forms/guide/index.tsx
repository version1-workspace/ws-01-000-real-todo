import Icon from "@/components/shared/icon"
import styles from "./index.module.css"

interface Props {
  message: string
}

export default function FormGuide({ message }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Icon name="info" size="18px" color="var(--primary-color)" />
      </div>
      <p className={styles.text}>{message}</p>
    </div>
  )
}
