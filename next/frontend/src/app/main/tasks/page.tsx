import TaskList from "@/components/tasks/list";
import styles from "./page.module.css";

export default function Tasks() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>タスク</h2>
        </div>
        <TaskList />
      </div>
    </div>
  );
}
