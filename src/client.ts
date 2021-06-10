import axios, { AxiosInstance, AxiosResponse } from "axios";
import { AuthToken, Item, ItemTemplate, Optional, User, UserTemplate } from "./types";

export const baseUrl = "http://localhost:8000"

export interface ResponseError {
  errorCode: number
  message: string
}

export interface Response<T> {
  res: Optional<T>
  error: Optional<ResponseError>
}

export type AsyncResponse<T> = Promise<Response<T>>

export async function handleResponse<T extends any>(response: Promise<AxiosResponse<T>>): AsyncResponse<T> {
  return response.then((res) => {
    return {
      res: res.data,
      error: null
    }
  }).catch(error => {
    return {
      res: null,
      error: {
        errorCode: error.response.status,
        message: error.response.data.detail
      }
    }
  });
}

export class Client {
  client: AxiosInstance;
  refreshClient: AxiosInstance;
  isRefreshing: boolean;
  refreshQueue: any[];

  constructor() {
    this.client = axios.create({baseURL: baseUrl, withCredentials: true});
    this.refreshClient = axios.create({baseURL: baseUrl, withCredentials: true});
    this.isRefreshing = false;
    this.refreshQueue = [];
    this.client.interceptors.response.use(
      response => {
        return response;
      }, 
      error => {
        const {config: originalRequest, 
              response: {status}} = error;

        if (status !== 401) {
          return Promise.reject(error)
        }

        if (originalRequest._retry) {
          return Promise.reject(error)
        }

        originalRequest._retry = true;
        if (!this.isRefreshing) {
          this.isRefreshing = true;

          this.refreshAuthToken()
            .then((response) => {
              const {res} = response;
              if (res) {
                const newToken = `${res.tokenType} ${res.accessToken}`
                originalRequest.headers["Authorization"] = newToken;
                this.client.defaults.headers.common["Authorization"] = newToken;
              }
              this.refreshQueue.forEach((v) => v.resolve(res))
              this.refreshQueue = []
            })
            .catch(() => {
              this.refreshQueue.forEach((v) => v.reject(error))
              this.refreshQueue = []
            })
            .finally(() => {
              this.isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
          this.refreshQueue.push({
            resolve: (res: any) => {
              const config = {...originalRequest, ...res}
              resolve(this.client.request(config))
            },
            reject: (err: any) => {
              reject(err)
            },
          })
        });
      }
    );
  }

  async login(username: string, password: string): AsyncResponse<void> {
    return this.client.post(`/auth/login`, null, {params: {
      username,
      password
    }}).then(res => {
      if (res) {
        const authHeader = `${res.data.tokenType} ${res.data.accessToken}`
        this.client.defaults.headers.common["Authorization"] = authHeader;
      }
      return {res: null,
              error: null};
    }).catch(error => {
      return {
        res: null,
        error: {
          errorCode: error.response.status,
          message: error.response.data.detail
        }
      }
    })
  }

  async logout(): AsyncResponse<void> {
    const response = this.refreshClient.post("/auth/logout");
    return handleResponse(response);
  }

  async register(user: UserTemplate): AsyncResponse<User> {
    const response = this.client.post(`/auth/`, user);
    return handleResponse<User>(response);
  }

  async refreshAuthToken(): AsyncResponse<AuthToken> {
    const response = this.refreshClient.post(`/auth/refresh/`)
    return handleResponse(response);
  }

  async getItems(): AsyncResponse<Item[]> {
    const response = this.client.get(`/items/`);
    return handleResponse<Item[]>(response);
  }

  async createItem(item: ItemTemplate): AsyncResponse<Item> {
    const response = this.client.post("/items/", item);
    return handleResponse<Item>(response);
  }

  async deleteItem(itemId: number): AsyncResponse<void> {
    const response = this.client.delete(`/items/${itemId}`)
    return handleResponse<void>(response);
  }

  async getCurrentUser(): AsyncResponse<User> {
    const response = this.client.get("/user/me/");
    return handleResponse<User>(response)
  }
}