const koaBody = require('koa-body')()

/**
 * Common middleware that should run before any route handler
 */

module.exports = function () {
  return [
    koaBody,
    async function (ctx, next) {
      ctx.body = ctx.request.body
      await next()
    }
  ]
}
