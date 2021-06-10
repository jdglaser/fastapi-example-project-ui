import React, { useState } from "react";
import { ClientRequest, useClientRequest } from "../hooks";
import { Optional } from "../types";

export default function LoginPage() {
  const {clientRequest, login, isAuthenticated} = useClientRequest();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<Optional<string>>(null);

  async function onLogin() {
    const {error} = await login(username, password);
    if (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <>
      <div className="error">{errorMessage}</div>
      <div className="login form">
          <label style={{width: "fit-content"}}>Username: </label>
          <input type="text"
                value={username}
                onChange={(evt) => setUsername(evt.target.value)} />
          <label>Password: </label>
          <input type="password"
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value)} />
          <button onClick={onLogin}>Login</button>
      </div>
    </>
  )
}