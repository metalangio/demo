import React from "react"
import { Router } from 'react-router'
import routes from "./lib/routes"
import ReactDOM from "react-dom"

ReactDOM.render(
  <Router routes={routes} />,
  document.getElementById("main"))
