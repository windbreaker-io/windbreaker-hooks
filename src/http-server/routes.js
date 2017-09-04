const logger = require('~/src/logging').logger(module)

exports.register = function (app, router) {
  ;[
    '~/src/http-server/routes/healthcheck',
    '~/src/http-server/routes/github'
  ].forEach((routePath) => {
    const route = require(routePath)

    let { middleware, method, path, handler } = route

    logger.info('Registering route: ', method, path)
    method = method.toLowerCase()

    // TODO: Add middleware for calculating request time

    if (middleware) {
      router[method](path, ...middleware, handler)
    } else {
      router[method](path, handler)
    }

    // TODO: Add back koa-path-router
    // method = method.toUpperCase()
    // router.register({ path, method, middleware, handler })
  })
}
