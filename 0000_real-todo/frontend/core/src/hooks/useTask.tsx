import { createContext, useContext, useState } from "react";
import api from "@/services/api";
import { Task, TaskParams } from "@/services/api/models/task";
import { factory } from "@/services/api/models";
import { Pagination } from "@/services/api/models/pagination";
import { Params as FilterParams } from "@/components/tasks/list/hooks/useFilter";

type Params = { page: number } & Partial<FilterParams>;

interface ITaskContext {
  data?: Pagination<Task>;
  fetch: (params: Params) => Promise<void>;
}

const TasksContext = createContext<ITaskContext>({
  data: undefined,
  fetch: async (_params: Params) => {},
});

export const TaskListContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<Pagination<Task>>();
  const fetch = async ({
    page,
    statuses,
  }: { page?: number } & Partial<FilterParams>) => {
    const res = await api.fetchTasks({
      page: page || 1,
      status: Object.keys(statuses || {}),
    });
    const { data: tasks, pageInfo } = res.data;
    const list = tasks.map((it: TaskParams) => factory.task(it));
    setData(
      new Pagination<Task>({
        list,
        pageInfo,
      }),
    );
  };

  return (
    <TasksContext.Provider value={{ data, fetch }}>
      {children}
    </TasksContext.Provider>
  );
};

const useTasks = () => {
  const { data, fetch } = useContext(TasksContext);

  return {
    data,
    fetch,
  };
};

export default useTasks;
