const Koa = require('koa')
// const Router = require('koa-path-router')
const router = require('koa-router')()

exports.create = function () {
  const config = require('~/src/config')
  const routes = require('./routes')

  const app = new Koa()

  // TODO: Get koaBody working with koa-path-router
  // app.use(koaBody)
  //   .use(ctx => {
  //     ctx.body = ctx.request.body
  //   })
  //
  // const router = new Router()
  // routes.register(app, router)
  //
  // app.use(router.getRequestHandler())

  // router.post('/github/:id', koaBody,
  //     (ctx) => {
  //       console.log(ctx.request.body)
  //       ctx.body = 'Hello'
  //     }
  // )

  routes.register(app, router)

  app.use(router.routes())
  app.use(router.allowedMethods())

  // TODO: Use koa-sslify to add certs
  app.listen(config.getHttpServerPort())

  console.log('Starting on port: ', config.getHttpServerPort())
}
