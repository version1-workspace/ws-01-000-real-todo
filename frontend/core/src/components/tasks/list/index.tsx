"use client";
import { ReactNode } from "react";
import styles from "./index.module.css";
import useFilter from "@/components/tasks/list/hooks/useFilter";
import useTasks from "@/contexts/tasks";
import TaskTable from "../table";
import Pagination from "@/components/shared/pagination";
import { CheckContainer } from "@/contexts/check";
import TaskListHeader from "./header";

interface Props {
  header?: ReactNode;
  footer?: ReactNode;
}

export default function TaskList({ header, footer }: Props) {
  const filter = useFilter({
    onInit: async (params) => {
      fetch({ page: 1, ...params });
    }
  });
  const { data, fetch } = useTasks();

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
