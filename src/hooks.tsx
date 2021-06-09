import { History } from "history";
import React, { createContext, useContext, useState } from "react";
import { useHistory } from "react-router";
import { AsyncResponse, Client } from "./client";
import { User, UserTemplate } from "./types";

export type ClientRequest = (request: (client: Client) => AsyncResponse<any>) => AsyncResponse<any>;

const client = new Client()

export function useProvideClientRequest(history: History) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  async function clientRequest<T extends any>(request: (client: Client) => AsyncResponse<T>): AsyncResponse<T> {
    const {res, error} = await request(client);
    if (error && error.errorCode === 401) {
      setIsAuthenticated(false);
      history.push("/login")
    }
    return {res, error}
  }

  async function login(username: string, password: string): AsyncResponse<void> {
    const response = await client.login(username, password);
    const {res, error} = response;
    if (!error) {
      setIsAuthenticated(true);
      history.push("/items")
    } else {
      setIsAuthenticated(false);
    }

    return response;
  }

  async function register(user: UserTemplate): AsyncResponse<User> {
    const response = await client.register(user);
    const {res} = response;

    if (res) {
      await client.login(user.username, user.password);
    }

    return response;
  }

  return {clientRequest, login, register, isAuthenticated}
}

const clientRequestContext = createContext({} as ReturnType<typeof useProvideClientRequest>);

export function ProvideClientRequest({children}: any) {
  const history = useHistory();
  const clientRequest = useProvideClientRequest(history);
  return <clientRequestContext.Provider value={clientRequest}>{children}</clientRequestContext.Provider>;
}

export const useClientRequest = () => {
  return useContext(clientRequestContext);
};
