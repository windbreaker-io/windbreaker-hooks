const Koa = require('koa')
const Router = require('koa-path-router')

let server

exports.create = function () {
  const config = require('~/src/config')
  const routes = require('./routes')

  const app = new Koa()
  const router = new Router()

  routes.register(app, router)
  app.use(router.getRequestHandler())

  // TODO: Use koa-sslify to add certs
  server = app.listen(config.getHttpServerPort())

  console.log('Starting on port: ', config.getHttpServerPort())
}

exports.close = function () {
  server.close()
}
