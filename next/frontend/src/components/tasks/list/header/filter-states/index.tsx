import { IoCloseCircle as Close } from "react-icons/io5";
import Icon from "@/components/shared/icon";
import type { Params } from "@/components/tasks/list/hooks/useFilter";
import { ja } from "@/lib/transltate";
import styles from "./index.module.css";

const taskTranslations = ja.derive("task")!;
const taskStatuses = ja.derive("task.status")!;

interface Props {
  date: Params["date"];
  isDateSet: boolean;
  order: Params["order"];
  projectName?: string;
  statuses: Params["statuses"];
  text: Params["text"];
  onReset: (key: keyof Params) => void;
}

export default function FilterStates({
  date,
  isDateSet,
  order,
  projectName,
  statuses,
  text,
  onReset,
}: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.state}>
        <div className={styles.label}>
          プロジェクト:
          {projectName || "指定なし"}
        </div>
        <div className={styles.spacer}>
          <button
            className={styles.close}
            type="button"
            onClick={() => onReset("projectId")}
          >
            <Icon name="close" size="12px" />
          </button>
        </div>
      </span>
      <span className={styles.state}>
        <label>ステータス: </label>
        {Object.keys(statuses || {})
          .map((key) => taskStatuses.t(key))
          .join("、") || "なし"}
        <button
          className={styles.close}
          type="button"
          onClick={() => onReset("statuses")}
        >
          <Icon name="close" size="12px" />
        </button>
      </span>
      <span className={styles.state}>
        <label>タスク名: </label>
        {text || "なし"}
        <button
          className={styles.close}
          type="button"
          onClick={() => onReset("text")}
        >
          <Icon name="close" size="12px" />
        </button>
      </span>
      {isDateSet ? (
        <span className={styles.state}>
          <label>{taskTranslations.t(date.type)} : </label>
          {date.start} ~ {date.end}
          <button
            className={styles.close}
            type="button"
            onClick={() => onReset("date")}
          >
            <Close size="12px" />
          </button>
        </span>
      ) : null}
      <span className={styles.state}>
        <label>並び替え: </label>
        {taskTranslations.t(order.type)}
        {order.value === "asc" ? <Icon name="down" /> : <Icon name="up" />}
        <button
          className={styles.close}
          type="button"
          onClick={() => onReset("order")}
        >
          <Icon name="close" size="12px" />
        </button>
      </span>
    </div>
  );
}
