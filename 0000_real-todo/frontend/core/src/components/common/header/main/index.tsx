"use client";
import styles from "./index.module.css";
import { useModal } from "@/lib/modal";
import TaskForm from "@/components/tasks/form";
import Icon from "../../icon";
import useProjects from "@/hooks/useProjects";
import useTasks from "@/hooks/useTask";

export default function Header() {
  const { open, hide } = useModal();
  const { projects, options } = useProjects();
  const { fetch: fetchTasks } = useTasks();

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <h2>Turbo</h2>
          </div>
          <div className={styles.searchForm}>
            <div className={styles.search}>
              <Icon name="search" size="24px" color="#2e2e2e" />
              <input type="text" placeholder="タスクタイトルで検索" />
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <Icon
                interactive="hoverDark"
                name="add"
                size="24px"
                onClick={() => {
                  open({
                    content: (
                      <TaskForm
                        title="タスクを追加"
                        projectsContext={{
                          options,
                          projects,
                        }}
                        onSubmit={() => {
                          fetchTasks({
                            page: 1,
                            statuses: { scheduled: true },
                          });
                          hide();
                        }}
                        onCancel={hide}
                      />
                    ),
                  });
                }}
              />
            </li>
            <li className={styles.menuItem}>
              <Icon name="info" interactive="hoverDark" size="24px" />
            </li>
            <li className={styles.menuItem}>
              <Icon name="notification" interactive="hoverDark" size="24px" />
            </li>
          </ul>
          <div className={styles.avatarIcon}>
            <div className={styles.avatarCircleContaiener}>
              <Icon name="person" interactive="hover" size="20px" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
