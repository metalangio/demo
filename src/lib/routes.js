import { Route, Redirect } from 'react-router'
import Main from "../components/Main"
import App from "../components/App"
import VideoApp from "../components/VideoApp"
import React from "react"

export default (
  <Route>
    <Redirect from="/" to="video"/>
    <Route path="/">
      <Route path="text" component={App} />
      <Route path="video" component={VideoApp} />
    </Route>
  </Route>
)
