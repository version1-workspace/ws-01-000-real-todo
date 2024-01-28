import axios, { AxiosError, AxiosInstance } from "axios";
import mockApi from "./mock";
import { TaskParams } from "./models/task";

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
  fetchUser: () => {
    return client.instance.get("/users/me");
  },
  fetchProjects: () => {
    return client.instance.get("/users/projects");
  },
  fetchStats: mockApi.fetchStats,
  fetchTasks: ({ page, status }: { page: number; status: string[] }) => {
    return client.instance.get("/users/tasks", {
      params: { page, status },
    });
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
  createTask: ({
    data,
  }: {
    data: Partial<{
      title: string;
      projectId: string;
      deadline: string;
      startingAt: string;
      status: string;
      kind: string;
    }>;
  }) => {
    return client.instance.post(`/users/tasks`, data);
  },
  updateTask: ({ userId, taskId }: { userId: string; taskId: string }) => {},
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
