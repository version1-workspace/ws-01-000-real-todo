"use client";
import styles from "@/components/project/forms/milestone/index.module.css";
import dayjs from "dayjs";
import { useState } from "react";
import useForm from "@/app/main/projects/new/context";
import { Task } from "@/services/api/models/task";
import Goal from "@/components/project/goal";
import Item from "@/components/project/forms/milestone/item";
import { classHelper, join } from "@/lib/cls";
import { IoAddOutline as Add } from "react-icons/io5";
import { factory } from "@/services/api/models";

interface Props {
  readOnly?: boolean;
  className?: string;
}

export default function Milestone({ className, readOnly }: Props) {
  const { project, setProject } = useForm();
  const [milestone, setMilestone] = useState<Task | undefined>(undefined);

  const milestones = [...project.milestones, ...(milestone ? [milestone] : [])];

  return (
    <div className={join(styles.container, className)}>
      <Goal readOnly />
      <div className={styles.timeline}>
        <div className={styles.left}>
          <div className={styles.bar}></div>
        </div>
        <div className={styles.right}>
          {milestones.map((item, index) => {
            return (
              <Item
                key={item.id}
                project={project}
                item={item}
                readOnly={readOnly}
                className={
                  !readOnly && index === milestones.length - 1
                    ? styles.lastStep
                    : ""
                }
                onSave={(task: Task) => {
                  if (task.isPersist) {
                    setProject(project.setMilestone(index, task)!);
                  } else {
                    setProject(project.addMilestone(task.scheduled()));
                    setMilestone(undefined);
                  }
                }}
                onRemove={() => {
                  if (item.isPersist) {
                    setProject(project.removeMilestone(index));
                  } else {
                    setMilestone(undefined);
                  }
                }}
              />
            );
          })}
          {!readOnly ? (
            <div className={styles.add}>
              <div className={styles.addButtonContainer}>
                {!milestone ? (
                  <div
                    className={styles.addButton}
                    onClick={() => {
                      const milestone = factory.task({
                        title: "",
                        kind: "milestone",
                        status: "initial",
                        uuid: "",
                        description: "",
                        createdAt: dayjs().format(),
                        updatedAt: dayjs().format(),
                        deadline: dayjs().format("YYYY-MM-DD"),
                        project: project.params()!,
                        children: [],
                      });

                      setMilestone(milestone);
                    }}>
                    <Add />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <div
            className={classHelper({
              [styles.current]: true,
              [styles.withoutMilestone]: !milestones.length,
            })}>
            <div className={styles.circle}></div>
            <p className={styles.date}>今日 ({dayjs().format("YYYY-MM-DD")})</p>
          </div>
        </div>
      </div>
    </div>
  );
}
