import styles from "@/components/project/card/index.module.css";
import Icon from "@/components/shared/icon";
import { rgbaToHex } from "@/lib/cls";
import { Project } from "@/viewmodels/project";

interface Props {
  data: Project;
}

const iconColor = "#636363";

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
          <Icon
            className={styles.deadlineIcon}
            name="clearCalendar"
            size="12px"
            color={iconColor}
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
                <Icon name="milestone" size="12px" color={iconColor} />
              </span>
              <span className={styles.statsText}>
                {data.stats?.kinds.milestone || 0}
              </span>
            </p>
            <p className={styles.task}>
              <span className={styles.icon}>
                <Icon name="tasks" size="12px" color={iconColor} />
              </span>
              <span className={styles.statsText}>{data.stats?.kinds.task}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
