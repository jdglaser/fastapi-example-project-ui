import React from "react";
import App from "./app/App"
import {BrowserRouter as Router} from "react-router-dom";
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