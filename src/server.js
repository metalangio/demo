import express from "express"
import React from "react"
import App from "./components/App"
import ReactDOMServer from "react-dom/server"
import { match, RoutingContext } from 'react-router'
import routes from "./lib/routes"

import model from "./lib/falcor/model"

const app = express()

app.use(express.static("static"))

app.get("*", (req, res) => {
  match({ routes, location: req.url },
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.serach)
      } else if (renderProps) {
        res.status(200).send(
          `<!DOCTYPE html>
            <html>
              <head>
                <title>Word Search Demo</title>
                <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">
                <script src="https://cdn.firebase.com/js/client/2.4.2/firebase.js"></script>
              </head>
              <body>
                <div id="main">`
                  + ReactDOMServer.renderToString(
                      <RoutingContext {...renderProps} />
                    ) +
                `</div>
                <script src="/build/client.js"></script>
              </body>
            </html>`
        )
      } else {
        res.status(404).send("Not Found")
      }
  })
})

app.listen(3000, err => {
  if (err) {
    console.log(err)
    return
  }

  console.log("Server started on port 3000");
})

model.get(['pages', 0, "body"]).then(x => console.log(JSON.stringify(x.json)))
