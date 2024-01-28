import styles from "./index.module.css";
import { Task } from "@/services/api/models/task";
import {
  IoCalendarOutline as Calendar,
  IoCheckmark as Check,
  IoPencil as Edit,
  IoCheckmark as Done,
  IoArchiveOutline as Archive,
} from "react-icons/io5";
import Icon from "@/components/common/icon";
import { join } from "@/lib/cls";
import PopupMenu from "@/components/tasks/popupMenu";

interface Props {
  data: Task;
  containerStyle?: { [key: string]: any };
  onComplete: (task: Task) => void;
  onReopen: (task: Task) => void;
  onArchive: (task: Task) => void;
  onEdit: (task: Task) => void;
}

interface Actions {
  onEdit: () => void;
  onArchive: () => void;
  onComplete: () => void;
}

const getActions = ({ onEdit, onComplete, onArchive }: Actions) => [
  {
    key: "edit",
    logo: <Edit className={styles.logo} />,
    text: "編集する",
    onClick: onEdit,
  },
  {
    key: "complete",
    logo: <Done className={styles.logo} />,
    text: "完了する",
    onClick: onComplete,
  },
  {
    key: "archive",
    logo: <Archive className={styles.logo} />,
    text: "アーカイブ",
    danger: true,
    onClick: onArchive,
  },
];

export default function TaskItem({
  containerStyle,
  data,
  onReopen,
  onComplete,
  onEdit,
  onArchive,
}: Props) {
  const actions = getActions({
    onEdit: () => onEdit(data),
    onComplete: () => onComplete(data),
    onArchive: () => onArchive(data),
  });

  return (
    <div
      className={styles.container}
      style={containerStyle}
      onClick={() => onEdit(data)}>
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
        <PopupMenu
          trigger={<Icon name="menu" interactive="pulse" />}
          actions={actions}
        />
      </div>
    </div>
  );
}
