import { builder } from "@/services/api/models";
import dayjs from "dayjs";

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

const api = {
  fetchProjects,
  fetchStats,
};

export default api;
