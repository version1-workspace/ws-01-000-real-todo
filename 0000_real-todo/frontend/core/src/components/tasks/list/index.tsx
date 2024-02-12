"use client";
import { ReactNode, useEffect } from "react";
import styles from "./index.module.css";
import useFilter from "@/components/tasks/list/hooks/useFilter";
import useTasks from "@/hooks/useTasks";
import TaskTable from "../table";
import Pagination from "../pagination";
import { CheckContainer } from "@/hooks/useCheck";
import TaskListHeader from "./header";

interface Props {
  displayCount: number;
  header?: ReactNode;
  footer?: ReactNode;
}

export default function TaskList({ header, footer }: Props) {
  const filter = useFilter();
  const { data, fetch } = useTasks();

  useEffect(() => {
    fetch({ page: 1, ...filter.replica });
  }, []);

  if (!data) {
    return null;
  }

  return (
    <CheckContainer>
      <div className={styles.container}>
        {header || <TaskListHeader filter={filter} />}
        <TaskTable data={data.list} />
        {footer || (
          <div className={styles.footer}>
            <Pagination
              page={data.page}
              pageCount={data.pageCount}
              hasNext={data.hasNext}
              hasPrevious={data.hasPrevious}
              onFetch={(page) => {
                fetch({ page, ...filter.replica });
              }}
            />
          </div>
        )}
      </div>
    </CheckContainer>
  );
}
