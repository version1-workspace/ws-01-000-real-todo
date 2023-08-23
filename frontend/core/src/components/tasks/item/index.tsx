import styles from "./index.module.css";
import { Task } from "@/services/api/models/task";
import {
  IoCalendarOutline as Calendar,
  IoCheckmark as Check,
  IoEllipsisVerticalOutline as Menu
} from "react-icons/io5";
import { join } from "@/lib/cls";

interface Props {
  data: Task;
  containerStyle?: { [key: string]: any };
  onComplete: (task: Task) => void;
  onReopen: (task: Task) => void;
}

export default function TaskItem({
  containerStyle,
  data,
  onReopen,
  onComplete,
}: Props) {
  return (
    <div className={styles.container} style={containerStyle}>
      <div className={styles.left}>
        {data.isCompleted ? (
          <div
            className={join(styles.checkbox, styles.completed)}
            onClick={() => {
              if (!confirm("このタスクを未完了にしますか？")) {
                return;
              }

              onReopen(data);
            }}>
            <Check />
          </div>
        ) : (
          <div
            className={styles.checkbox}
            onClick={() => onComplete(data)}></div>
        )}
      </div>
      <div className={styles.middle}>
        <div className={styles.header}>
          <p className={styles.title}>
            {data.isArchived ? "(アーカイブ済み)" : null}
            {data.title}
          </p>
        </div>
        <div className={styles.body}>
          <p className={styles.date}>
            <span>作成日時 : </span>
            {data.createdAt.format()}
          </p>
          <p className={styles.date}>
            <span>更新日時 : </span>
            {data.updatedAt.format()}
          </p>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.header}>
          <p className={styles.deadline}>
            <Calendar size={12} />
            {data.deadline.format()}
          </p>
        </div>
        <div className={styles.body}>
          <p className={styles.project}>{data.project.name}</p>
        </div>
      </div>
      <div className={styles.menu}>
        <Menu />
      </div>
    </div>
  );
}
