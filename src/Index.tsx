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

export default function Index() {
  return (
    <>
      <Router>
        <App />
      </Router>
    </>
  )
}