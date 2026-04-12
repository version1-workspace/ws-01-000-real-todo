"use client";
import { ReactNode, useEffect } from "react";
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
  const { data, fetch } = useTasks();
  const filter = useFilter();

  useEffect(() => {
    fetch(filter.replica);
  }, [filter.replica]);

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
                const newReplica = { ...filter.replica, page };
                filter.save(newReplica);
                fetch(newReplica);
              }}
            />
          </div>
        )}
      </div>
    </CheckContainer>
  );
}
