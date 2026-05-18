"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth"
import PopupMenu from "@/components/shared/popupMenu"
import TaskForm from "@/components/tasks/form"
import Search from "@/components/tasks/search"
import useTasks from "@/contexts/tasks"
import { useModal } from "@/lib/modal"
import route from "@/lib/route"
import Icon from "../../icon"
import styles from "./index.module.css"

const iconSize = 20

function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return null
  }

  return (
    <PopupMenu
      header={
        <div className={styles.userMenuHeader}>
          <div className={styles.userMenuAvatar}>
            {user.username.slice(0, 1)}
          </div>
          <div className={styles.userMenuInfo}>
            <p className={styles.userMenuName}>{user.username}</p>
            <p className={styles.userMenuEmail}>{user.email}</p>
          </div>
        </div>
      }
      trigger={
        <button
          aria-label="ユーザーメニューを開く"
          className={styles.userMenuTrigger}
          type="button"
        >
          <span className={styles.avatarCircleContaiener}>
            <Icon name="person" interactive="hover" size={iconSize * 0.8} />
          </span>
          <Icon name="caretDown" size={14} />
        </button>
      }
      actions={[
        {
          key: "profile",
          text: "プロフィール",
          logo: <Icon name="person" size={16} />,
          onClick: () => {
            router.push(route.main.users.profile.toString())
          },
        },
        {
          key: "settings",
          text: "設定",
          logo: <Icon name="settings" size={16} />,
          onClick: () => {
            router.push(route.main.users.settings.design.toString())
          },
        },
        {
          key: "notification",
          text: "通知設定",
          logo: <Icon name="notification" size={16} />,
          onClick: () => {
            router.push(route.main.users.settings.notification.toString())
          },
        },
        {
          key: "logout",
          text: "ログアウト",
          danger: true,
          divider: true,
          logo: <Icon name="logout" size={16} />,
          onClick: () => {
            logout()
          },
        },
      ]}
    />
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
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
