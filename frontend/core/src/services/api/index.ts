import { builder } from "./model";

const mockApi = <T>({ data }: { data: T }) => {
  return {
    data,
    status: 200,
  };
};

export const fetchProjects = () => {
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
