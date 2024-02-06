"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { factory } from "@/services/api/models";
import { Project } from "@/services/api/models/project";
import styles from "./page.module.css";
import { join } from "@/lib/cls";
import Icon from "@/components/common/icon";
import route from "@/lib/route";
import TextInput from "@/components/common/input/text";
import MilestoneList from "@/components/milestones/list";

interface Props {
  params: {
    slug: string;
  };
}

export default function Project({ params: { slug } }: Props) {
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const init = async () => {
      const res = await api.fetchProject({ slug });
      const item = factory.project(res.data);

      setProject(item);
    };

    init();
  }, []);

  if (!project) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>プロジェクト名: {project.name}</h1>
          {project.stats ? (
            <ul className={styles.stats}>
              <li>
                <div className={styles.stat}>
                  <Icon name="calendar" className={styles.statIcon} />
                  {project.stats.states.scheduled}
                </div>
              </li>
              <li>
                <div className={styles.stat}>
                  <Icon name="complete" className={styles.statIcon} />{" "}
                  {project.stats.states.completed}
                </div>
              </li>
              <li>
                <div className={join(styles.stat, styles.lastStat)}>
                  <Icon name="archive" className={styles.statIcon} />{" "}
                  {project.stats.states.archived}
                </div>
              </li>
            </ul>
          ) : null}
        </div>
        <div className={styles.body}>
          <div className={styles.project}>
            <div className={styles.field}>
              <label className={styles.label}>
                <span className={styles.labelText}>ゴール: </span>
              </label>
              <div className={styles.goalContainer}>
                <p className={styles.deadline}>
                  <span className={styles.fromText}>
                    あと {project.deadline?.from()} 日
                  </span>
                  <span className={styles.fromDate}>
                    ({project.deadline?.format()})
                  </span>
                </p>
                <p className={join(styles.text, styles.goal)}>{project.goal}</p>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                <span className={styles.labelText}>あるべき姿: </span>
              </label>
              <p className={styles.text}>{project.shouldbe}</p>
            </div>
            <div className={styles.border}></div>
            <div className={styles.field}>
              <label className={styles.label}>スラッグ: </label>
              <p className={join(styles.text, styles.slug)}>
                <span className={styles.slugBasePath}>
                  {route.main.projects.with("")}
                </span>{" "}
                <TextInput value={project.slug} />
              </p>
            </div>
          </div>
          <div className={styles.taskList}>
            <MilestoneList slug={project.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
