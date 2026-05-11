import styles from "@/components/project/forms/goal/index.module.css"
import FormGuide from "@/components/project/forms/guide"
import Project from "@/components/project/forms/project"
import Goal from "@/components/project/goal"
import { join } from "@/lib/cls"

interface Props {
  className?: string
}

export default function GoalForm({ className }: Props) {
  return (
    <>
      <div className={join(styles.card, className || "")}>
        <Project />
        <div className={styles.border}></div>
        <Goal />
      </div>
      <FormGuide message="ゴールを設定して、プロジェクトの方向性を明確にしましょう。" />
    </>
  )
}
