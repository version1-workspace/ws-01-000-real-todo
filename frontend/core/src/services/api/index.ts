import axios, { AxiosError, AxiosInstance } from "axios";
import mockApi from "./mock";

let accessToken: string;

export const getAccessToken = () => accessToken;

export const setUserId = (uuid: string) => localStorage.setItem("uuid", uuid);
export const getUserId = () => localStorage.getItem("uuid") || "";

class Client {
  _instance?: AxiosInstance;
  _errorHandler?: (error: AxiosError) => void;

  constructor(config: {
    baseURL: string;
    timeout: number;
    withCredentials?: boolean;
    headers: {
      Authorization?: string;
    };
  }) {
    this._instance = axios.create({
      ...config,
      headers: {
        ...(config.headers || {}),
      },
    });
  }

  get instance() {
    if (!this._instance) {
      throw new Error("client is not initialized properly");
    }

    return this._instance;
  }

  setAccessToken = (token: string) => {
    accessToken = token;
    if (this._instance) {
      this._instance.defaults.headers["Authorization"] = `Bearer ${token}`;
    }
  };

  setErrorHandler = (handler: (error: AxiosError) => void) => {
    this.instance.interceptors.response.use(function (response) {
      return response;
    }, handler);
  };
}

const client = new Client({
  baseURL: "http://localhost:7000/api/v1",
  timeout: 1000,
  withCredentials: true,
  headers: { Authorization: getAccessToken() },
});

const api = {
  client,
  refreshToken: ({ uuid }: { uuid: string }) => {
    return client.instance.post("/auth/refresh", {
      uuid,
    });
  },
  logout: () => {
    return client.instance.delete("/auth/refresh");
  },
  fetchUser: () => {
    return client.instance.get("/users/me");
  },
  createProject: (project: {
    name: string;
    slug: string;
    deadline: string;
    goal: string;
    shouldbe?: string;
    status: "active";
    milestones: {
      title: string;
      deadline: string;
    }[];
  }) => {
    return client.instance.post(`/users/projects`, project);
  },
  updateProject: (
    slug: string,
    project: {
      name: string;
      slug: string;
      deadline: string;
      goal: string;
      shouldbe?: string;
    },
  ) => {
    return client.instance.patch(`/users/projects/${slug}`, project);
  },
  fetchProject: ({ slug }: { slug: string }) => {
    return client.instance.get(`/users/projects/${slug}`);
  },
  fetchProjects: ({
    limit,
    page,
    status,
  }: Partial<{
    limit: number;
    page: number;
    status: string[];
  }>) => {
    return client.instance.get("/users/projects", {
      params: {
        limit,
        page,
        status,
      },
    });
  },
  archiveProject({ slug }: { slug: string }) {
    return client.instance.patch(`/users/projects/${slug}/archive`);
  },
  reopenProject({ slug }: { slug: string }) {
    return client.instance.patch(`/users/projects/${slug}/reopen`);
  },
  fetchStats: mockApi.fetchStats,
  fetchTask: ({ id }: { id: string }) => {
    return client.instance.get(`/users/tasks/${id}`);
  },
  fetchTasks: ({
    page,
    status,
    limit,
    search,
    sortType,
    sortOrder,
    dateFrom,
    dateTo,
    dateType,
    projectId,
  }: Partial<{
    page: number;
    status: string[];
    limit: number;
    search: string;
    sortType: string;
    sortOrder: string;
    dateFrom: string;
    dateTo: string;
    dateType: string;
    projectId: string;
  }>) => {
    return client.instance.get("/users/tasks", {
      params: {
        page,
        status,
        limit,
        search,
        sortType,
        sortOrder,
        dateFrom,
        dateTo,
        dateType,
        projectId,
      },
    });
  },
  fetchMilestones: ({ slug }: { slug: string }) => {
    return client.instance.get(`/projects/${slug}/milestones`);
  },
  archiveMilestone: ({ slug, id }: { id: string; slug: string }) => {
    return client.instance.put(`/projects/${slug}/milestones/${id}/archive`);
  },
  completeTask: ({ id }: { id: string }) => {
    return client.instance.put(`/users/tasks/${id}/complete`);
  },
  reopenTask: ({ id }: { id: string }) => {
    return client.instance.put(`/users/tasks/${id}/reopen`);
  },
  archiveTask: ({ id }: { id: string }) => {
    return client.instance.put(`/users/tasks/${id}/archive`);
  },
  bulkCompleteTask: ({ ids }: { ids: string[] }) => {
    return client.instance.put(`/bulk/tasks/complete`, { ids });
  },
  bulkArchiveTask: ({ ids }: { ids: string[] }) => {
    return client.instance.put(`/bulk/tasks/archive`, { ids });
  },
  bulkReopenTask: ({ ids }: { ids: string[] }) => {
    return client.instance.put(`/bulk/tasks/reopen`, { ids });
  },
  createTask: ({
    data,
  }: {
    data: Partial<{
      title: string;
      projectId: string;
      deadline: string;
      startingAt: string;
      finishedAt: string;
      status: string;
      kind: string;
    }>;
  }) => {
    return client.instance.post(`/users/tasks`, data);
  },
  updateTask: (
    id: string,
    data: Partial<{
      title: string;
      projectId: string;
      parentId: string;
      deadline: string;
      startingAt: string;
      finishedAt: string;
      status: string;
      kind: string;
    }>,
  ) => {
    const _data = Object.keys(data).reduce((acc, key) => {
      const v = data[key as keyof typeof data];
      if (["deadline", "startingAt", "finishedAt"].includes(key)) {
        return {
          ...acc,
          [key]: v?.replaceAll("/", "-"),
        };
      }

      return {
        ...acc,
        [key]: v,
      };
    }, {});
    return client.instance.patch(`/users/tasks/${id}`, _data);
  },
  authenticate: async ({
    email,
    password,
    rememberMe,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    const res = await client.instance.post("/auth/login", {
      email,
      password,
      rememberMe,
    });

    return res.data;
  },
};

export default api;
