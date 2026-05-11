import dayjs from "dayjs"
import useForm from "@/app/main/projects/new/context"
import { classHelper } from "@/lib/cls"
import styles from "./index.module.css"

interface Props {
  shadow?: boolean
  readOnly?: boolean
}

export default function Goal({ shadow, readOnly }: Props) {
  const { project, errors, setProject } = useForm()

  return (
    <div
      className={classHelper({
        [styles.container]: true,
        [styles.shadow]: shadow,
      })}
    >
      <h3 className={styles.title}>ゴール設定</h3>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.left}>
            <p className={styles.label}>
              目標<span className={styles.required}>*</span>
            </p>
            <p className={styles.description}>
              期限日までに達成する目標を記載してください
            </p>
          </div>
          <div className={styles.col}>
            {readOnly ? (
              <p>{project.goal}</p>
            ) : (
              <input
                readOnly={readOnly}
                className={styles.input}
                type="text"
                placeholder="目標 (期限日までに転職する etc...)"
                value={project.goal}
                onChange={(e) => {
                  setProject(project.withGoal(e.target.value)!)
                }}
              />
            )}
            <p className={styles.error}>{errors?.goal}</p>
          </div>
        </div>
        {!(readOnly && project.shouldbe === "") ? (
          <div className={styles.row}>
            <div className={styles.left}>
              <p className={styles.label}>あるべき姿</p>
              <p className={styles.description}>
                目標達成後の理想の状態を具体的に
              </p>
            </div>
            <div className={styles.col}>
              {readOnly ? (
                <p>{project.shouldbe}</p>
              ) : (
                <input
                  readOnly={readOnly}
                  className={styles.input}
                  type="text"
                  placeholder="あるべき姿 (目標に向かう上で常に意識すべきこと）"
                  value={project.shouldbe}
                  onChange={(e) => {
                    setProject(project.withShouldbe(e.target.value)!)
                  }}
                />
              )}
              <p className={styles.error}>{errors?.shouldbe}</p>
            </div>
          </div>
        ) : null}
        <div className={styles.row}>
          <div className={styles.left}>
            <p className={styles.label}>
              期限日<span className={styles.required}>*</span>
            </p>
            <p className={styles.description}>
              目標の達成期限を設定してください
            </p>
          </div>
          <div className={styles.col}>
            {readOnly ? (
              <p>{project.deadline.toString()}</p>
            ) : (
              <input
                min={dayjs().format("YYYY-MM-DD")}
                readOnly={readOnly}
                className={styles.input}
                value={project.deadline.toString()}
                type="date"
                onChange={(e) => {
                  setProject(project.withDeadline(e.target.value)!)
                }}
              />
            )}
            <p className={styles.error}>{errors?.deadline}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
