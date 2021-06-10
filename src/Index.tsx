import React from "react";
import App from "./App"
import {BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useHistory} from "react-router-dom";
import LoginPage from "./Login";
import RegisterPage from "./RegisterPage";
import ItemPage from "./ItemPage";
import { ProvideClientRequest } from "./hooks";

export default function Index() {
  return (
    <>
      <Router>
        <ProvideClientRequest>
          <App />
        </ProvideClientRequest>
      </Router>
    </>
  )
}