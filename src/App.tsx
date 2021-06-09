import React, { useState } from 'react';
import {NavLink, Route, Switch, useHistory} from "react-router-dom";
import './App.css';
import {ProvideClientRequest, useClientRequest } from './hooks';
import ItemPage from "./ItemPage";
import LoginPage from './Login';
import RegisterPage from './RegisterPage';

export default function App() {
  const [tab, setTab] = useState<string>("login");

  return (
    <ProvideClientRequest>
      <div className="App">
        <h1>App</h1>
          <nav>
            <NavLink to="/login" className="nav-link" activeClassName="nav-link active">Login</NavLink>
            <NavLink to="/register" className="nav-link" activeClassName="nav-link active">Register</NavLink>
            <NavLink to="/items" className="nav-link" activeClassName="nav-link active">Items</NavLink>
          </nav>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/register">
              <RegisterPage />
            </Route>
            <Route path="/items">
              <ItemPage />
            </Route>
            <Route path="/">
              <div>
                Welcome to the app
              </div>
            </Route>
          </Switch>
      </div>
    </ProvideClientRequest>
  )
}
