import styles from "./index.module.css";
import { IoCheckmarkCircle as Check } from "react-icons/io5";

export default function Complete() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>プロジェクト作成完了</h2>
      <div className={styles.body}>
        <div className={styles.icon}>
          <Check size="128px" color="#76e0a7" />
        </div>
        <p>プロジェクトの作成が完了しました！!</p>
        <p>プロジェクトページからさらに詳細を決めましょう。</p>
      </div>
    </div>
  );
}
