const dao = require('~/src/dao')
const koaBody = require('koa-body')()
const logger = require('~/src/logging').logger(module)

/**
* Middleware that is shared amongst all webhoook routes
*
* @param type {WebhookType}
*/
module.exports = function (type) {
  return [
    koaBody,
    async function (ctx, next) {
      ctx.body = ctx.request.body
      await next()
    },
    async function (ctx, next) {
      const id = ctx.params.id
      let isValidWebhook = await dao.isValidWebhook(id, type)

      if (!isValidWebhook) {
        logger.error(`Invalid webhook id "${id}" received in request`)
        ctx.throw(400, `Invalid webhook id "${id}" received in request`)
      }
    }
  ]
}
