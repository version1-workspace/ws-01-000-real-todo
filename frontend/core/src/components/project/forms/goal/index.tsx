import { useContext } from "react";
import styles from "@/components/project/forms/goal/index.module.css";
import Goal from "@/components/project/goal";
import { join } from "@/lib/cls";
import { FormContext } from "@/app/main/projects/new/context";

interface Props {
  className?: string;
}

export default function GoalForm({ className }: Props) {
  const {
    project,
    errors,
    mutations: { setProject },
  } = useContext(FormContext);

  return (
    <div className={join(styles.container, className || "")}>
      <h3 className={styles.title}>プロジェクト</h3>
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
            onChange={(e) => {
              setProject(project.withName(e.target.value)!);
            }}
          />
          <p className={styles.error}>{errors?.name}</p>
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
            onChange={(e) => {
              setProject(project.withSlug(e.target.value)!);
            }}
          />
          <p className={styles.error}>{errors?.slug}</p>
        </div>
      </div>
      <Goal />
    </div>
  );
}
