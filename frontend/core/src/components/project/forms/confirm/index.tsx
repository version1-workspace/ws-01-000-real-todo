import styles from "@/components/project/forms/confirm/index.module.css";
import Milestone from "@/components/project/forms/milestone";
import Project from "@/components/project/forms/project";

export default function Confirm() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>確認</h2>
      <div className={styles.description}>
        <p>
          プロジェクト作成の確認画面です。内容を確認して右下の確認ボタンをクリックしてください。
          内容は作成後も変更できます。
        </p>
      </div>
      <div className={styles.section}>
        <Project readOnly />
      </div>
      <div className={styles.section}>
        <Milestone readOnly />
      </div>
    </div>
  );
}
