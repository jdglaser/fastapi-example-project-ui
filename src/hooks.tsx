import { History } from "history";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AsyncResponse, Client } from "./client";
import { User, UserTemplate } from "./types";

export type ClientRequest = (request: (client: Client) => AsyncResponse<any>) => AsyncResponse<any>;

const client = new Client()

export function useProvideClientRequest(history: History) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>();
  const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(true);

  async function updateUser() {
    setLoadingUserInfo(true);
    clientRequest(client => client.getCurrentUser())
      .then(({res}) => {
        if (res) {
          setIsAuthenticated(true);
          setCurrentUser(res);
        } else {
          setIsAuthenticated(false);
        }
    }).then(() => setLoadingUserInfo(false))
  }

  async function clientRequest<T extends any>(request: (client: Client) => AsyncResponse<T>): AsyncResponse<T> {
    const {res, error} = await request(client);
    if (error && error.errorCode === 401) {
      setIsAuthenticated(false);
      history.push("/login");
    }
    return {res, error}
  }

  async function login(username: string, password: string): AsyncResponse<void> {
    const response = await client.login(username, password);
    const {res, error} = response;
    if (!error) {
      setIsAuthenticated(true);
      updateUser();
      history.push("/items")
    } else {
      setIsAuthenticated(false);
    }

    return response;
  }

  async function logout() {
    await client.logout();

    setIsAuthenticated(false);
    setCurrentUser({} as User);
    history.push("/login")
  }

  async function register(user: UserTemplate): AsyncResponse<User> {
    const response = await client.register(user);
    const {res} = response;

    if (res) {
      await login(user.username, user.password);
    }

    return response;
  }

  useEffect(() => {
    updateUser()
  }, [])

  return {clientRequest, login, register, logout, isAuthenticated, currentUser, loadingUserInfo}
}

export function useOverlay() {
  const [overlayIsOn, setOverlayIsOn] = useState<boolean>(false);

  return {overlayIsOn, setOverlayIsOn}
}

type blah = ReturnType<typeof useProvideClientRequest> & ReturnType<typeof useOverlay>

const clientRequestContext = createContext({} as blah);

export function ProvideClientRequest({children}: any) {
  const history = useHistory();
  const clientRequest = useProvideClientRequest(history);
  const overlay = useOverlay();
  return <clientRequestContext.Provider value={{...clientRequest, ...overlay}}>{children}</clientRequestContext.Provider>;
}

export const useClientRequest = () => {
  return useContext(clientRequestContext);
};
