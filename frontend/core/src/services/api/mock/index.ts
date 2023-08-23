import { builder } from "@/services/api/models";
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
        builder.project({
          name: "プログラミング",
          deadline: "2023/08/12",
          slug: "programming",
          goal: "期限日までにフロントエンドエンジニアとして就職する。",
          shouldbe: "エンジニアとしての学習習慣を身につけて生活する。",
          stats: {
            milestone: 4,
            task: 30,
            totalTask: 132,
          },
        }),
        builder.project({
          name: "プログラミング",
          deadline: "2023/08/12",
          slug: "programming",
          goal: "期限日までにフロントエンドエンジニアとして就職する。",
          shouldbe: "エンジニアとしての学習習慣を身につけて生活する。",
          stats: {
            milestone: 4,
            task: 30,
            totalTask: 132,
          },
        }),
        builder.project({
          name: "プログラミング",
          deadline: "2023/08/12",
          slug: "programming",
          goal: "期限日までにフロントエンドエンジニアとして就職する。",
          shouldbe: "エンジニアとしての学習習慣を身につけて生活する。",
          stats: {
            milestone: 4,
            task: 30,
            totalTask: 132,
          },
        }),
      ],
    }),
  );
};

const fetchStats = () => {
  return Promise.resolve(
    mockApi({
      data: [
        builder.stats({
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
        builder.stats({
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
      builder.task({
        id: index + 1,
        title: `タスク ${index + 1}`,
        status: "scheduled",
        createdAt: "2023-08-23T00:00:00-07:00",
        updatedAt: "2023-08-23T00:00:00-07:00",
        deadline: "2023-08-30T00:00:00-07:00",
        children: [],
        project: {
          name: "プログラミング",
          deadline: "",
          slug: "programming",
          goal: "",
          shouldbe: "",
          stats: {
            milestone: 0,
            task: 0,
            totalTask: 0,
          },
        },
      }),
    )
    .slice((_page - 1) * per, _page * per);
  const pagination = new Pagination<Task>({
    list: _data,
    pageInfo: {
      page: _page,
      per: per,
      total,
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
