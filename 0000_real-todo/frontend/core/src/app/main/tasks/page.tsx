import TaskList from '@/components/tasks/list';
import styles from './page.module.css'

export default function Tasks() {
  return <div className={styles.container}>
    <TaskList />
  </div>
}
