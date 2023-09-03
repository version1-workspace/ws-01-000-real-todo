import dayjs from "dayjs";
import { useContext } from "react";
import styles from "./index.module.css";
import { FormContext } from "@/app/main/projects/new/context";

interface Props {
  readOnly?: boolean;
}

export default function Goal({ readOnly }: Props) {
  const {
    project,
    errors,
    mutations: { setProject },
  } = useContext(FormContext);
  return (
    <div className={styles.group}>
      <h3 className={styles.title}>ゴール設定</h3>
      <div className={styles.groupContent}>
        <div className={styles.row}>
          <div className={styles.left}>
            目標<span className={styles.required}>*</span>
          </div>
          <div className={styles.col}>
            <input
              readOnly={readOnly}
              className={styles.input}
              type="text"
              placeholder="目標 (期限日までに転職する etc...)"
              value={project.goal}
              onChange={(e) => {
                setProject(project.withGoal(e.target.value)!);
              }}
            />
            <p className={styles.error}>{errors?.goal}</p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.left}>あるべき姿</div>
          <div className={styles.col}>
            <input
              readOnly={readOnly}
              className={styles.input}
              type="text"
              placeholder="あるべき姿 (目標に向かう上で常に意識すべきこと）"
              value={project.shouldbe}
              onChange={(e) => {
                setProject(project.withShouldbe(e.target.value)!);
              }}
            />
            <p className={styles.error}>{errors?.shouldbe}</p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.left}>
            期限日<span className={styles.required}>*</span>
          </div>
          <div className={styles.col}>
            <input
              min={dayjs().format("YYYY-MM-DD")}
              readOnly={readOnly}
              className={styles.input}
              value={project.deadline.toString()}
              type="date"
              onChange={(e) => {
                setProject(project.withDeadline(e.target.value)!);
              }}
            />
            <p className={styles.error}>{errors?.deadline}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
