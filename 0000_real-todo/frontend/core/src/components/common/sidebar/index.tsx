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
import route from "@/lib/route";
import useProjects from "@/contexts/projects";

const colors = (function () {
  const list = [];
  for (let i = 0; i < 10; i++) {
    const code = ((i + 1) * 140) % 760;
    const r = Math.max(code - 510, 0);
    const g = Math.min(Math.max(code - 255, 0), 255);
    const b = Math.min(255, code);
    list.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
  }

  return list;
})();

export default function Sidebar() {
  const { projects } = useProjects();
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
                <li>
                  <Link href={route.main.toString()}>
                    <div
                      className={classHelper({
                        [styles.menuItem]: true,
                        [styles.menuItemActive]:
                          pathname === route.main.toString(),
                      })}>
                      <p className={styles.menuTitle}>ダッシュボード</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href={route.main.tasks.toString()}>
                    <div
                      className={classHelper({
                        [styles.menuItem]: true,
                        [styles.menuItemActive]:
                          pathname === route.main.tasks.toString(),
                      })}>
                      <p className={styles.menuTitle}>タスク</p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="#!">
                    <div
                      className={classHelper({
                        [styles.menuItem]: true,
                        [styles.menuItemActive]:
                          pathname === route.main.projects.toString(),
                      })}>
                      <p className={styles.menuTitle}>プロジェクト</p>
                    </div>
                  </Link>
                </li>
                <ul className={styles.projects}>
                  {projects.map((item, index) => {
                    return (
                      <li
                        key={item.slug}
                        className={classHelper({
                          [styles.menuItem]: true,
                          [styles.menuItemActive]:
                            pathname === route.main.projects.with(item.slug),
                        })}>
                        <Link href={route.main.projects.with(item.slug)}>
                          <div className={styles.project}>
                            <div>
                              <span
                                className={styles.dot}
                                style={{ background: colors[index] }}></span>
                              {item.name}
                            </div>
                            <span className={styles.deadline}>
                              {item.deadline?.format()}
                            </span>
                          </div>
                        </Link>
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
