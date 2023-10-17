import { useContext } from "react";
import styles from "@/components/project/forms/confirm/index.module.css";
import Milestone from "@/components/project/forms/milestone";
import { FormContext } from "@/app/main/projects/new/context";

export default function Confirm() {
  const { project } = useContext(FormContext);
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
        <h3 className={styles.sectionTitle}>プロジェクト</h3>
        <div className={styles.row}>
          <div className={styles.left}>
            プロジェクト名
            <span className={styles.required}>*</span>
          </div>
          <div className={styles.col}>
            <input
              className={styles.input}
              type="text"
              placeholder="プロジェクト名"
              value={project.name}
              readOnly
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.left}>
            スラッグ<span className={styles.required}>*</span>
          </div>
          <div className={styles.col}>
            <input
              className={styles.input}
              type="text"
              placeholder="スラッグ"
              value={project.slug}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <Milestone readOnly />
      </div>
    </div>
  );
}
