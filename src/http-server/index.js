const Koa = require('koa')
const Router = require('koa-path-router')
const bodyParser = require('koa-bodyparser')

exports.create = function () {
  const config = require('~/src/config')
  const routes = require('./routes')

  const app = new Koa()
  const router = new Router()

  routes.register(app, router)

  app
    .use(bodyParser())
    .use(async (ctx) => {
      ctx.body = ctx.request.body
    })
    .use(router.getRequestHandler())

  // TODO: Use koa-sslify to add certs
  app.listen(config.getHttpServerPort())

  console.log('Starting on port: ', config.getHttpServerPort())
}
