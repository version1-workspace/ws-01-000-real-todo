"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/main/page.module.css";
import api from "@/services/api";
import { Project } from "@/services/api/models/project";
import Card from "@/components/project/card";
import Chart from "@/components/project/chart";
import TaskList from "@/components/tasks/list";

export default function Main() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const init = async () => {
      const res = await api.fetchProjects();
      setProjects(res.data);
    };

    init();
  }, []);

  return (
    <div className={styles.projects}>
      <div className={styles.dashboard}>
        <div className={styles.list}>
          <h2 className={styles.sectionTitle}>プロジェクト</h2>
          <div className={styles.content}>
            {projects.map((item) => {
              return (
                <Link key={item.slug} href={item.slug}>
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