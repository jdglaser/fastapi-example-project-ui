import React, { useState } from 'react';
import { NavLink, Route, Switch } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import { useClientRequest } from '../hooks';
import '../style/App.css';
import ItemPage from "./ItemPage";
import LoginPage from './Login';
import RegisterPage from './RegisterPage';
import UserAccountPage from './UserAccountPage';
import ScreenOverlay from "./ScreenOverlay";

export default function App() {
  const {isAuthenticated, loadingUserInfo, overlayIsOn} = useClientRequest();
  const {} = useClientRequest()

  if (loadingUserInfo) {
    return (
      <div style={{width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <BeatLoader color="lightseagreen" loading={loadingUserInfo} size={15} margin={3} />
      </div>
    )
  }

  return (
      <div className="App">
        <div className="nav-bar">
          <nav>
            <h3 className="logo">Cool App</h3>
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
        </div>
        <div className="content">
          <ScreenOverlay isOn={overlayIsOn}/>
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
      </div>
  )
}
