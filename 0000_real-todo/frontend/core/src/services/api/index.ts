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
  fetchProject: ({ slug }: { slug: string }) => {
    return client.instance.get(`/users/projects/${slug}`);
  },
  fetchProjects: () => {
    return client.instance.get("/users/projects");
  },
  fetchStats: mockApi.fetchStats,
  fetchTask: ({ id }: { id: string }) => {
    return client.instance.get(`/users/tasks/${id}`);
  },
  fetchTasks: ({ page, status }: { page: number; status: string[] }) => {
    return client.instance.get("/users/tasks", {
      params: { page, status },
    });
  },
  fetchMilestones: ({ slug }: { slug: string; }) => {
    return client.instance.get(`/projects/${slug}/milestones`);
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
      deadline: string;
      startingAt: string;
      finishedAt: string;
      status: string;
      kind: string;
    }>,
  ) => {
    const _data = Object.keys(data).reduce((acc, key) => {
      const v = data[key];
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
