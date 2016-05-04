import { Route } from 'react-router'
import Main from "../components/Main"
import App from "../components/App"
import VideoApp from "../components/VideoApp"
import Counter from "../components/Counter"
import Page from "../components/Page"
import PageController from "../components/PageController"
import React from "react"

export default (
  <Route path="/" component={Main}>
    <Route path="text" component={App} />
    <Route path="video" component={VideoApp} />
  </Route>
)
