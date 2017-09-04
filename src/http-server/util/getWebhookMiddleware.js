const koaBody = require('koa-body')()

module.exports = function () {
  return [
    koaBody,
    async function (ctx, next) {
      ctx.body = ctx.request.body
      await next()
    }
  ]
}
