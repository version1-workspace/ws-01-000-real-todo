import Projet from "@/components/project/card";
import axios, { AxiosError, AxiosInstance } from "axios";

let accessToken: string;

export const getAccessToken = () => accessToken;

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
  fetchProjects: () => {
    return client.instance.get("/users/projects")
  },
  fetchStats: () => [],
  fetchTasks: () => [],
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
