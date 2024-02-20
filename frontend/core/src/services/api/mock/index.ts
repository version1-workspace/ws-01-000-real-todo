import { factory } from "@/services/api/models";
import dayjs from "dayjs";
import { Pagination } from "@/services/api/models/pagination";
import { Task } from "@/services/api/models/task";

const mockApi = <T>({ data }: { data: T }) => {
  return {
    data,
    status: 200,
  };
};

const fetchProjects = () => {
  return Promise.resolve(
    mockApi({
      data: [
        factory.project({
          uuid: "",
          name: "プログラミング",
          deadline: "2023/08/12",
          slug: "programming",
          goal: "期限日までにフロントエンドエンジニアとして就職する。",
          shouldbe: "エンジニアとしての学習習慣を身につけて生活する。",
          stats: {
            kinds: {
              milestone: 4,
              task: 30,
              total: 34,
            },
            states: {
              scheduled: 30,
              archived: 3,
              completed: 1,
            },
            total: 132,
          },
          milestones: [],
          status: "active",
          createdAt: dayjs().format(),
          updatedAt: dayjs().format(),
        }),
        factory.project({
          uuid: "",
          name: "プログラミング",
          deadline: "2023/08/12",
          slug: "programming",
          goal: "期限日までにフロントエンドエンジニアとして就職する。",
          shouldbe: "エンジニアとしての学習習慣を身につけて生活する。",
          stats: {
            kinds: {
              milestone: 4,
              task: 30,
              total: 34,
            },
            states: {
              scheduled: 30,
              archived: 3,
              completed: 1,
            },
            total: 132,
          },
          milestones: [],
          status: "active",
          createdAt: dayjs().format(),
          updatedAt: dayjs().format(),
        }),
        factory.project({
          uuid: "",
          name: "プログラミング",
          deadline: "2023/08/12",
          slug: "programming",
          goal: "期限日までにフロントエンドエンジニアとして就職する。",
          shouldbe: "エンジニアとしての学習習慣を身につけて生活する。",
          stats: {
            kinds: {
              milestone: 4,
              task: 30,
              total: 34,
            },
            states: {
              scheduled: 30,
              archived: 3,
              completed: 1,
            },
            total: 132,
          },
          milestones: [],
          status: "active",
          createdAt: dayjs().format(),
          updatedAt: dayjs().format(),
        }),
      ],
    }),
  );
};

const fetchStats = () => {
  return Promise.resolve(
    mockApi({
      data: [
        factory.stats({
          label: "完了タスク",
          type: "completed",
          data: [
            {
              date: dayjs().add(-3, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 40),
            },
            {
              date: dayjs().add(-2, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 40),
            },
            {
              date: dayjs().add(-1, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 40),
            },
            {
              date: dayjs().add(0, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 40),
            },
            {
              date: dayjs().add(1, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 40),
            },
            {
              date: dayjs().add(2, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 40),
            },
            {
              date: dayjs().add(3, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 40),
            },
          ],
        }),
        factory.stats({
          label: "予定タスク",
          type: "todo",
          data: [
            {
              date: dayjs().add(-3, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 100),
            },
            {
              date: dayjs().add(-2, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 100),
            },
            {
              date: dayjs().add(-1, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 100),
            },
            {
              date: dayjs().add(0, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 100),
            },
            {
              date: dayjs().add(1, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 100),
            },
            {
              date: dayjs().add(2, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 100),
            },
            {
              date: dayjs().add(3, "day").toDate().getTime(),
              value: Math.floor(Math.random() * 100),
            },
          ],
        }),
      ],
    }),
  );
};

interface FetchTasksParams {
  page?: number;
}

export const fetchTasks = ({ page }: FetchTasksParams) => {
  const total = 100;
  const _page = page || 1;
  const per = 10;
  const _data = new Array(total)
    .fill("")
    .map((_, index) =>
      factory.task({
        uuid: "",
        description: "",
        kind: "task",
        title: `タスク ${index + 1}`,
        status: "scheduled",
        createdAt: "2023-08-23T00:00:00-07:00",
        updatedAt: "2023-08-23T00:00:00-07:00",
        deadline: "2023-08-30T00:00:00-07:00",
        children: [],
        project: {
          uuid: "",
          name: "プログラミング",
          deadline: "",
          slug: "programming",
          goal: "",
          shouldbe: "",
          stats: {
            kinds: {
              milestone: 4,
              task: 30,
              total: 34,
            },
            states: {
              scheduled: 30,
              archived: 3,
              completed: 1,
            },
            total: 132,
          },
          milestones: [],
          status: "active",
          createdAt: dayjs().format(),
          updatedAt: dayjs().format(),
        },
      }),
    )
    .slice((_page - 1) * per, _page * per);
  const pagination = new Pagination<Task>({
    list: _data,
    pageInfo: {
      page: _page,
      limit: per,
      totalCount: total,
      hasNext: false,
      hasPrevious: false
    },
  });

  return Promise.resolve(mockApi({ data: pagination }));
};

const api = {
  fetchProjects,
  fetchStats,
  fetchTasks,
};

export default api;
