"use client";
import { ReactNode, useEffect } from "react";
import styles from "./index.module.css";
import useFilter from "@/components/tasks/list/hooks/useFilter";
import useTasks from "@/hooks/useTask";
import TaskTable from "../table";
import Pagination from "../pagination";
import { CheckContainer } from "@/hooks/useCheck";
import TaskListHeader from "./header";

interface Props {
  header?: ReactNode;
  footer?: ReactNode;
}

export default function TaskList({ header, footer }: Props) {
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
        {header || <TaskListHeader />}
        <TaskTable data={data.list} />
        {footer || (
          <div className={styles.footer}>
            <Pagination
              page={data.page}
              pageCount={data.pageCount}
              hasNext={data.hasNext}
              hasPrevious={data.hasPrevious}
              onFetch={(page) => {
                fetch({ page, ...replica });
              }}
            />
          </div>
        )}
      </div>
    </CheckContainer>
  );
}
