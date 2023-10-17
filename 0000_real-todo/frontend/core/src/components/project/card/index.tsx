import styles from "@/components/project/card/index.module.css";
import { Project } from "@/services/api/models/project";
import {
  IoCalendarOutline as Calendar,
  IoGitCommit as Milestone,
  IoDocumentText as Task,
} from "react-icons/io5";

interface Props {
  data: Project;
}

export default function Projet({ data }: Props) {
  return (
    <div key={data.slug} className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{data.name}</h2>
        <p className={styles.deadline}>
          <span>
            <Calendar size="10px" />
          </span>
          <p> {data.deadline}</p>
        </p>
      </div>
      <div className={styles.body}>
        <div className={styles.goal}>
          <span>ゴール : </span>
          <p>{data.goal}</p>
        </div>
        <div className={styles.shouldbe}>
          <span>あり方 : </span>
          <p>{data.shouldbe}</p>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.stats}>
          <p className={styles.milestone}>
            <span className={styles.icon}><Milestone size="12px" /></span>
            <span className={styles.statsText}>{data.stats.milestone}</span>
          </p>
          <p className={styles.task}>
            <span className={styles.icon}><Task size="12px"/></span>
            <span className={styles.statsText}>{data.stats.task}</span>
            <span className={styles.slash}>/</span>
            <span className={styles.statsText}>{data.stats.totalTask}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
