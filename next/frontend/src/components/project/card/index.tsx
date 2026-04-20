import {
  IoCalendarClear as Calendar,
  IoGitCommit as Milestone,
  IoDocument as Task,
} from "react-icons/io5"
import styles from "@/components/project/card/index.module.css"
import { rgbaToHex } from "@/lib/cls"
import { Project } from "@/viewmodels/project"

interface Props {
  data: Project
}

export default function Card({ data }: Props) {
  return (
    <div
      key={data.slug}
      className={styles.card}
      style={{
        borderLeft: `3px solid ${data.color}`,
      }}
    >
      <div className={styles.header}>
        <h2 className={styles.title} style={{ color: data.color }}>
          <span
            className={styles.titleWrapper}
            style={{ backgroundColor: rgbaToHex(data.color) + "10" }}
          >
            <span className={styles.titleText}>{data.name}</span>
          </span>
        </h2>
        <p className={styles.deadline}>
          <Calendar
            className={styles.deadlineIcon}
            size="12px"
            color="#636363"
          />
          <span className={styles.deadlineDate}>{data.deadline.format()}</span>
        </p>
      </div>
      <div className={styles.body}>
        <div className={styles.goal}>
          <p>{data.goal}</p>
        </div>
        <div className={styles.footer}>
          <div className={styles.shouldbe}>
            <p>{data.shouldbe}</p>
          </div>
          <div className={styles.stats}>
            <p className={styles.milestone}>
              <span className={styles.icon}>
                <Milestone size="12px" color="#636363" />
              </span>
              <span className={styles.statsText}>
                {data.stats?.kinds.milestone || 0}
              </span>
            </p>
            <p className={styles.task}>
              <span className={styles.icon}>
                <Task size="12px" color="#636363" />
              </span>
              <span className={styles.statsText}>{data.stats?.kinds.task}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
