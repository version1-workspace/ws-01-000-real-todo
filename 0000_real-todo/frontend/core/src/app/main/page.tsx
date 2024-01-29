"use client";

import Link from "next/link";
import styles from "@/app/main/page.module.css";
import Card from "@/components/project/card";
import Chart from "@/components/project/chart";
import TaskList from "@/components/tasks/list";
import route from "@/lib/route";
import useProjects from "@/hooks/useProjects";

export default function Main() {
  const { projects } = useProjects();

  return (
    <div className={styles.projects}>
      <div className={styles.dashboard}>
        <div className={styles.list}>
          <h2 className={styles.sectionTitle}>プロジェクト</h2>
          <div className={styles.content}>
            {projects.map((item) => {
              return (
                <Link
                  key={item.slug}
                  href={route.main.projects.child(item.slug)}>
                  <Card data={item} />
                </Link>
              );
            })}
          </div>
        </div>
        <div className={styles.chart}>
          <h2 className={styles.sectionTitle}>進捗</h2>
          <div className={styles.content}>
            <Chart />
          </div>
        </div>
      </div>
      <div className={styles.todos}>
        <h2 className={styles.sectionTitle}>タスク</h2>
        <div className={styles.content}>
          <TaskList />
        </div>
      </div>
    </div>
  );
}
