"use client";
import { useState } from "react";
import styles from "@/components/common/sidebar/index.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoChevronForward as ShowIcon,
  IoChevronBack as HiddenIcon,
} from "react-icons/io5";
import { classHelper } from "@/lib/cls";

const projects = [
  {
    name: "プログラミング",
    slug: "programmming",
    color: "#a00",
    href: "/main/projects/programming",
    deadline: "2023/12/31",
  },
  {
    name: "英語",
    slug: "english",
    color: "#0a0",
    href: "/main/projects/english",
    deadline: "2023/12/31",
  },
  {
    name: "プライベート",
    slug: "private",
    color: "#00a",
    href: "/main/projects/private",
    deadline: "2023/12/31",
  },
];

export default function Sidebar() {
  const [show, setShow] = useState(true);
  const pathname = usePathname();

  return (
    <div
      className={classHelper({
        [styles.sidebar]: true,
        [styles.sidebarShow]: show,
        [styles.sidebarHidden]: !show,
      })}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span
            className={styles.sidebarToggle}
            onClick={() => setShow((show) => !show)}>
            {show ? <HiddenIcon /> : <ShowIcon />}
          </span>
        </div>
        <div className={styles.body}>
          {show ? (
            <>
              <ul className={styles.menu}>
                <li
                  className={classHelper({
                    [styles.menuItem]: true,
                    [styles.menuItemActive]: pathname === "/main",
                  })}>
                  <Link className={styles.menuTitle} href="/main">
                    ダッシュボード
                  </Link>
                </li>
                <li
                  className={classHelper({
                    [styles.menuItem]: true,
                    [styles.menuItemActive]: pathname === "/main/todos",
                  })}>
                  <Link className={styles.menuTitle} href="/main/todos">
                    タスク
                  </Link>
                </li>
                <li
                  className={classHelper({
                    [styles.menuItem]: true,
                    [styles.menuItemActive]: pathname === "/main/projects",
                  })}>
                  <Link className={styles.menuTitle} href="/main/projects">
                    プロジェクト
                  </Link>
                </li>
                <ul className={styles.projects}>
                  {projects.map((item) => {
                    return (
                      <li
                        key={item.slug}
                        className={classHelper({
                          [styles.menuItem]: true,
                          [styles.menuItemActive]: pathname === item.href,
                        })}>
                        <div className={styles.project}>
                          <div>
                            <span
                              className={styles.dot}
                              style={{ background: item.color }}></span>
                            <Link href={item.href}>{item.name}</Link>
                          </div>
                          <span className={styles.deadline}>
                            {item.deadline}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ul>
            </>
          ) : null}
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  );
}
