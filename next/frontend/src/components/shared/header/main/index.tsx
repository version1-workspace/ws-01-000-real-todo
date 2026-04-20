"use client"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth"
import TaskForm from "@/components/tasks/form"
import Search from "@/components/tasks/search"
import useTasks from "@/contexts/tasks"
import { useModal } from "@/lib/modal"
import route from "@/lib/route"
import Icon from "../../icon"
import styles from "./index.module.css"

interface DropdownProps {
  trigger: React.ReactNode
}

const iconSize = 20

function Dropdown({ trigger }: DropdownProps) {
  const { user, logout } = useAuth()
  const [show, setShow] = useState(false)

  if (!user) {
    return null
  }

  return (
    <div className={styles.dropdownContainer}>
      {show ? (
        <div className={styles.overlay} onClick={() => setShow(false)}></div>
      ) : null}
      <p className={styles.trigger} onClick={() => setShow(true)}>
        {trigger}
      </p>
      {show ? (
        <ul className={styles.dropdown}>
          <li
            className={styles.dropdownItem}
            onClick={() => {
              setShow(false)
            }}
          >
            <Link
              className={styles.dropdownLink}
              href={route.main.users.profile.toString()}
            >
              <div className={styles.dropdownIcon}>
                <Icon name="person" size={20} />
              </div>
              プロフィール
            </Link>
          </li>
          <li>
            <div className={styles.border}></div>
          </li>
          <li
            className={styles.dropdownItem}
            onClick={() => {
              logout()
              setShow(false)
            }}
          >
            <div className={styles.dropdownLink}>
              <div className={styles.dropdownIcon}>
                <Icon name="logout" size={20} color="var(--danger-color)" />
              </div>
              <p className={styles.logout}>ログアウト</p>
            </div>
          </li>
        </ul>
      ) : null}
    </div>
  )
}

export default function Header() {
  const { open, hide } = useModal()
  const { fetchDefault: fetchTasks } = useTasks()

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.logoContainer}>
            <Link href={route.main.toString()}>
              <div className={styles.logo}>
                <h2>Turvo</h2>
              </div>
            </Link>
          </div>
          <div className={styles.searchForm}>
            <Search />
          </div>
        </div>
        <div className={styles.right}>
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <Icon
                interactive="hoverDark"
                name="add"
                size={24}
                onClick={() => {
                  open({
                    content: (
                      <TaskForm
                        title="タスクを追加"
                        onSubmit={() => {
                          fetchTasks()
                          hide()
                        }}
                        onCancel={hide}
                      />
                    ),
                  })
                }}
              />
            </li>
            <li className={styles.menuItem}>
              <Icon name="info" interactive="hoverDark" size={iconSize} />
            </li>
            <li className={styles.menuItem}>
              <Icon
                name="notification"
                interactive="hoverDark"
                size={iconSize}
              />
            </li>
          </ul>
          <div className={styles.avatarIcon}>
            <Dropdown
              trigger={
                <div className={styles.avatarCircleContaiener}>
                  <Icon
                    name="person"
                    interactive="hover"
                    size={iconSize * 0.8}
                  />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </header>
  )
}
