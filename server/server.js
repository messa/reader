
import express from 'express'
import next from 'next'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'

import configuration from './configuration'
import { setupServer as setupServerAuth, authRouter } from './auth'
import getModel from './model'
import api from './api'

// make it easily stoppable if running inside Docker container
Array.from(["SIGINT", "SIGTERM"]).map((sig) => {
  process.on(sig, () => {
    process.exit();
  })
});

const model = getModel()

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  server.set('json spaces', 2)

  server.use(cookieParser())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())
  server.use(session({
    secret: configuration.get('session_secret'),
    resave: false,
    saveUninitialized: true,
  }))

  server.use((req, res, next) => {
    req.model = model;
    next();
  })

  setupServerAuth(server);
  server.use(authRouter);
  server.use('/api', api);

  server.get('/debug/user', (req, res) => (res.json({ user: req.user || '-' })));

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:3000 (pid ${process.pid})`)
  })
})
