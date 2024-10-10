import styles from "@/components/project/card/index.module.css";
import { Project } from "@/services/api/models/project";
import {
  IoCalendarClear as Calendar,
  IoGitCommit as Milestone,
  IoDocument as Task,
} from "react-icons/io5";

interface Props {
  data: Project;
}

export default function Projet({ data }: Props) {
  return (
    <div
      key={data.slug}
      className={styles.card}
      style={{
        borderLeft: `5px solid ${data.color}`,
      }}>
      <div className={styles.header}>
        <h2 className={styles.title} style={{ color: data.color }}>
          {data.name}
        </h2>
        <p className={styles.deadline}>
          <Calendar
            className={styles.deadlineIcon}
            color={data.color}
            size="10px"
          />
          <p className={styles.deadlineDate}>{data.deadline.format()}</p>
        </p>
      </div>
      <div className={styles.body}>
        <div className={styles.goal}>
          <p>{data.goal}</p>
        </div>
        {data.shouldbe ? (
          <div className={styles.shouldbe}>
            <p>{data.shouldbe}</p>
          </div>
        ) : null}
      </div>
      <div className={styles.footer}>
        <div className={styles.stats}>
          <p className={styles.milestone}>
            <span className={styles.icon}>
              <Milestone size="12px" color={data.color} />
            </span>
            <span className={styles.statsText}>
              {data.stats?.kinds.milestone || 0}
            </span>
          </p>
          <p className={styles.task}>
            <span className={styles.icon}>
              <Task size="12px" color={data.color} />
            </span>
            <span className={styles.statsText}>{data.stats?.kinds.task}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
