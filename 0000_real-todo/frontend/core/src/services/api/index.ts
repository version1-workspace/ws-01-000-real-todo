import mockAPI from "@/services/api/mock";
import axios, { AxiosError, AxiosInstance } from "axios";

let accessToken: string;

export const getAccessToken = () => accessToken;

const instance = axios.create({
  baseURL: "http://localhost:7000/api/v1",
  timeout: 1000,
  headers: { Authorization: getAccessToken() },
});

export const setAccessToken = (token: string) => {
  accessToken = token;
  instance.defaults.headers.common["Authorization"];
};

class Client {
  _instance?: AxiosInstance;
  _errorHandler?: (error: AxiosError) => void;

  constructor(config: {
    baseURL: string;
    timeout: number;
    headers: {
      Authorization?: string;
    };
  }) {
    this._instance = axios.create({
      ...config,
      headers: {
        Authorization: accessToken,
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
      this._instance.defaults.headers.common["Authorization"] = token;
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
  headers: { Authorization: getAccessToken() },
});

const api = {
  client,
  fetchProducts: () => [],
  fetchStats: () => [],
  fetchTasks: () => [],
  authenticate: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await client.instance.post("/auth/login", {
      email,
      password,
    });

    return res.data;
  },
};

export default api;
