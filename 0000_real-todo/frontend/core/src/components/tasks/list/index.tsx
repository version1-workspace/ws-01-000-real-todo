"use client";
import { useEffect } from "react";
import styles from "@/components/tasks/list/index.module.css";
import useFilter from "@/components/tasks/list/hooks/useFilter";
import { classHelper } from "@/lib/cls";
import { ja } from "@/lib/transltate";
import useTasks from "@/hooks/useTask";
import TaskTable from "../table";
import Icon from "@/components/common/icon";
import { CheckContainer } from "@/hooks/useCheck";
import TaskListHeader from "./header";

export default function TaskList() {
  const { replica } = useFilter();
  const { data, fetch } = useTasks();

  useEffect(() => {
    fetch(replica);
  }, []);

  if (!data) {
    return null;
  }

  return (
    <CheckContainer>
      <div className={styles.container}>
        <TaskListHeader />
        <TaskTable data={data} />
        <div className={styles.footer}>
          <ul className={styles.pagination}>
            <li
              className={styles.page}
              onClick={() => {
                if (!data.hasPrevious) {
                  return;
                }
                fetch({ page: data.page - 1, ...replica });
              }}>
              <Icon name="back" />
            </li>
            {new Array(data.pageCount).fill("").map((_, index) => {
              return (
                <li
                  className={classHelper({
                    [styles.page]: true,
                    [styles.active]: data.page === index + 1,
                  })}
                  key={`pagination-${index}`}
                  onClick={() => {
                    if (index + 1 === data.page) {
                      return;
                    }
                    fetch({ page: index + 1, ...replica });
                  }}>
                  {index + 1}
                </li>
              );
            })}
            <li
              className={styles.page}
              onClick={() => {
                if (!data.hasNext) {
                  return;
                }

                fetch({ page: data.page + 1, ...replica });
              }}>
              <Icon name="forward" />
            </li>
          </ul>
        </div>
      </div>
    </CheckContainer>
  );
}
