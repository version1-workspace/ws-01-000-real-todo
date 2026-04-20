"use client"

import { usePathname } from "next/navigation"
import { Fragment, ReactNode, useMemo, useState } from "react"
import {
  IoChevronBack as HiddenIcon,
  IoChevronForward as ShowIcon,
} from "react-icons/io5"
import Icon, { IconName } from "@/components/shared/icon"
import Link from "@/components/shared/link"
import styles from "@/components/shared/sidebar/index.module.css"
import useProjects from "@/contexts/projects"
import { classHelper } from "@/lib/cls"
import route from "@/lib/route"
import { truncate } from "@/lib/string"
import { Project } from "@/viewmodels/project"

interface MenuItem {
  title: string | ReactNode
  icon?: IconName
  path: string
  children?: MenuItem[]
  footer?: ReactNode
  options?: Record<string, any>
}

const projectCountLimit = 5

const sidebarMenulist = (projects: Project[]): MenuItem[] => [
  {
    icon: "dashboard",
    title: "ダッシュボード",
    path: route.main.toString(),
  },
  {
    title: "タスク",
    icon: "tasks",
    path: route.main.tasks.toString(),
  },
  {
    title: <>プロジェクト</>,
    icon: "project",
    path: route.main.projects.toString(),
    children: projects.slice(0, projectCountLimit).map((it) => {
      return {
        title: it.name,
        path: route.main.projects.with(it.slug),
        options: {
          deadline: it.deadline?.format(),
          color: it.color,
        },
      }
    }),
    footer: (function () {
      if (projects.length <= projectCountLimit) {
        return null
      }

      return (
        <>
          <Link href={route.main.projects.toString()}>
            <p className={styles.showMoreProjects}>
              あと {projects.length - projectCountLimit} プロジェクト
            </p>
          </Link>
          <Link
            className={styles.addProject}
            href={route.main.projects.new.toString()}
          >
            <Icon className={styles.addProjectIcon} name="add" />
            <p>新しいプロジェクトを作成</p>
          </Link>
        </>
      )
    })(),
  },
]

export default function Sidebar() {
  const { projects } = useProjects()
  const [show, setShow] = useState(true)
  const pathname = usePathname()

  const list = useMemo(() => sidebarMenulist(projects), [projects])

  return (
    <div
      className={classHelper({
        [styles.sidebar]: true,
        [styles.sidebarShow]: show,
        [styles.sidebarHidden]: !show,
      })}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <span
            className={styles.sidebarToggle}
            onClick={() => setShow((show) => !show)}
          >
            {show ? <HiddenIcon size={12} /> : <ShowIcon size={12} />}
          </span>
        </div>
        <div className={styles.body}>
          {show ? (
            <>
              <ul className={styles.menu}>
                {list.map((menuItem: MenuItem) => {
                  return (
                    <Fragment key={menuItem.path}>
                      <li key={menuItem.path}>
                        <Link href={menuItem.path}>
                          <div
                            className={classHelper({
                              [styles.menuItem]: true,
                              [styles.menuItemActive]:
                                pathname === menuItem.path,
                            })}
                          >
                            <div className={styles.menuIconWrapper}>
                              <Icon name={menuItem.icon ?? "unknown"} />
                            </div>
                            <p
                              className={classHelper({
                                [styles.menuTitle]: true,
                                [styles.menuTitleActive]:
                                  pathname === menuItem.path,
                              })}
                            >
                              {menuItem.title}
                            </p>
                          </div>
                        </Link>
                      </li>
                      {menuItem.children?.length ? (
                        <ul className={styles.children}>
                          {menuItem.children.map((item) => {
                            return (
                              <li
                                key={item.path}
                                className={classHelper({
                                  [styles.menuItem]: true,
                                  [styles.menuItemChildren]: true,
                                  [styles.menuItemActive]:
                                    pathname === item.path,
                                })}
                              >
                                <Link
                                  className={styles.projectLink}
                                  href={item.path}
                                >
                                  <div className={styles.project}>
                                    <div>
                                      <span
                                        className={styles.dot}
                                        style={{
                                          background: item.options?.color,
                                        }}
                                      ></span>
                                      {typeof item.title === "string"
                                        ? truncate(item.title, 10)
                                        : item.title}
                                    </div>
                                    <span className={styles.deadline}>
                                      {item.options?.deadline}
                                    </span>
                                  </div>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      ) : null}
                      <div className={styles.menuItemFooter}>
                        {menuItem.footer}
                      </div>
                    </Fragment>
                  )
                })}
              </ul>
            </>
          ) : null}
        </div>
        {show ? (
          <div className={styles.footer}>
            <ul className={styles.footerMenu}>
              <li className={styles.footerLinkItem}>
                <Link className={styles.footerLink} href="#!">
                  <Icon className={styles.footerLinkIcon} name="settings" />
                  <span className={styles.footerText}>設定</span>
                </Link>
              </li>
              <li className={styles.footerLinkItem}>
                <Link className={styles.footerLink} href="#!">
                  <Icon className={styles.footerLinkIcon} name="help" />
                  <span className={styles.footerText}>ヘルプ</span>
                </Link>
              </li>
            </ul>
            <div className={styles.theme}>
              <div className={styles.darkModeToggle}>
                <Icon className={styles.darkModeIcon} name="bulb" size={16} />
                ダークモード
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
