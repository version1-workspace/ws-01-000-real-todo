import TaskList from "@/components/tasks/list";
import styles from "@/app/main/todos/page.module.css";

export default function Todos() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>タスク</h2>
      <div className={styles.content}>
        <TaskList />
      </div>
    </div>
  );
}
