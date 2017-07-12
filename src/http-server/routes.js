exports.register = function (app, router) {
  [
    '~/src/http-server/routes/github'
  ].forEach((routePath) => {
    const route = require(routePath)

    let { method, path, handler } = route

    method = route.method.toUpperCase()

    let middleware = []

    // TODO: Add middleware for calculating request time

    router.register({ path, method, middleware, handler })
  })
}
