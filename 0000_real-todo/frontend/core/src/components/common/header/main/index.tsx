"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./index.module.css";
import { useModal } from "@/lib/modal";
import route from "@/lib/route";
import TaskForm from "@/components/tasks/form";
import Icon from "../../icon";
import useProjects from "@/hooks/useProjects";
import useTasks from "@/hooks/useTask";
import { useAuth } from "@/components/auth";

interface DropdownProps {
  trigger: React.ReactNode;
}

function Dropdown({ trigger }: DropdownProps) {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.dropdownContainer}>
      <p className={styles.trigger} onClick={() => setShow(true)}>
        {trigger}
      </p>
      {show ? (
        <ul className={styles.dropdown}>
          <li
            className={styles.dropdownItem}
            onClick={() => {
              setShow(false);
            }}>
            <div className={styles.userInfo}>
              <Link href={route.main.users.profile.toString()}>
                <p className={styles.username}>{user.username}</p>
                <p className={styles.email}>{user.email}</p>
              </Link>
            </div>
          </li>
          <li>
            <div className={styles.border}></div>
          </li>
          <li
            className={styles.dropdownItem}
            onClick={() => {
              logout();
              setShow(false);
            }}>
            <p className={styles.logout}>ログアウト</p>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

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
            <Dropdown
              trigger={
                <div className={styles.avatarCircleContaiener}>
                  <Icon name="person" interactive="hover" size="20px" />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
