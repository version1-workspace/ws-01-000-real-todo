import { useContext } from "react";
import styles from "@/components/project/forms/goal/index.module.css";
import { FormContext } from "@/app/main/projects/new/context";
import { classHelper } from "@/lib/cls";

interface Props {
  readOnly?: boolean;
  shadow?: boolean;
}

export default function ProjectForm({ shadow, readOnly }: Props) {
  const {
    project,
    errors,
    mutations: { setProject },
  } = useContext(FormContext);

  return (
    <div
      className={classHelper({
        [styles.container]: true,
        [styles.shadow]: shadow,
      })}>
      <h3 className={styles.title}>プロジェクト</h3>
      <div className={styles.row}>
        <div className={styles.left}>
          プロジェクト名
          <span className={styles.required}>*</span>
        </div>
        <div className={styles.col}>
          <input
            readOnly={readOnly}
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
            readOnly={readOnly}
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
    </div>
  );
}
