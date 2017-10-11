const logger = require('~/src/logging').logger(module)

exports.register = function (app, router) {
  ;[
    '~/src/http-server/routes/healthcheck',
    '~/src/http-server/routes/github'
  ].forEach((routePath) => {
    const route = require(routePath)

    let { middleware, method, path, handler } = route

    logger.info('Registering route: ', method, path)

    method = method.toUpperCase()
    router.register({ path, method, middleware, handler })
  })
}
