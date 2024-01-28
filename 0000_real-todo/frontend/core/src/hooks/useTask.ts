import { useState } from "react";
import api from "@/services/api";
import { Task, TaskParams } from "@/services/api/models/task";
import { factory } from "@/services/api/models";
import { Pagination } from "@/services/api/models/pagination";
import { Params as FilterParams } from "@/components/tasks/list/hooks/useFilter";

const useTasks = () => {
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

  const create = async ({
    data
  }: { data: TaskParams }) => {
    await api.createTask({ data })

  }

  return {
    data,
    fetch,
  };
};

export default useTasks;
