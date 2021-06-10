import React, { useState } from 'react';
import {NavLink, Route, Switch, useHistory} from "react-router-dom";
import './App.css';
import {ProvideClientRequest, useClientRequest } from './hooks';
import ItemPage from "./ItemPage";
import LoginPage from './Login';
import RegisterPage from './RegisterPage';
import UserAccountPage from './UserAccountPage';

export default function App() {
  const [tab, setTab] = useState<string>("login");

  const {isAuthenticated} = useClientRequest();

  return (
      <div className="App">
        <h1>App</h1>
          <nav>
            {!isAuthenticated ? 
              (
                <>
                  <NavLink to="/login" className="nav-link" activeClassName="nav-link active">Login</NavLink>
                  <NavLink to="/register" className="nav-link" activeClassName="nav-link active">Register</NavLink>
                </>
              )
              : null }
            {isAuthenticated ?
              (
                <>
                 <NavLink to="/items" className="nav-link" activeClassName="nav-link active">Items</NavLink>
                 <NavLink to="/account" className="nav-link" activeClassName="nav-link active">Account</NavLink>
                </>
              ) : null}
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
            <Route path="/account">
              <UserAccountPage />
            </Route>
            <Route path="/">
              <div>
                Welcome to the app
              </div>
            </Route>
          </Switch>
      </div>
  )
}
