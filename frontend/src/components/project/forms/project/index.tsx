import { useContext } from "react"
import { FormContext } from "@/app/main/projects/new/context"
import styles from "@/components/project/forms/goal/index.module.css"
import { classHelper } from "@/lib/cls"

interface Props {
  readOnly?: boolean
  shadow?: boolean
}

export default function ProjectForm({ shadow, readOnly }: Props) {
  const {
    project,
    errors,
    mutations: { setProject },
  } = useContext(FormContext)

  return (
    <div
      className={classHelper({
        [styles.container]: true,
        [styles.shadow]: shadow,
      })}
    >
      <h3 className={styles.title}>プロジェクト</h3>
      <div className={styles.row}>
        <div className={styles.left}>
          <p className={styles.label}>
            プロジェクト名
            <span className={styles.required}>*</span>
          </p>
          <p className={styles.description}>
            プロジェクトの名称を入力してください
          </p>
        </div>
        <div className={styles.col}>
          <input
            readOnly={readOnly}
            className={styles.input}
            type="text"
            placeholder="プロジェクト名"
            value={project.name}
            onChange={(e) => {
              setProject(project.withName(e.target.value)!)
            }}
          />
          <p className={styles.error}>{errors?.name}</p>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.left}>
          <p className={styles.label}>
            スラッグ<span className={styles.required}>*</span>
          </p>
          <p className={styles.description}>URLに使用される一意の識別子です</p>
        </div>
        <div className={styles.col}>
          <input
            readOnly={readOnly}
            className={styles.input}
            type="text"
            placeholder="スラッグ"
            value={project.slug}
            onChange={(e) => {
              setProject(project.withSlug(e.target.value)!)
            }}
          />
          <p className={styles.error}>{errors?.slug}</p>
        </div>
      </div>
    </div>
  )
}
