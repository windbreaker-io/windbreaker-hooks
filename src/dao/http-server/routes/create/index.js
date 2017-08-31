const koaBody = require('koa-body')()
const dao = require('~/src/dao')
const WebhookType = require('~/drc/models/WebhookType')
const logger = require('~/src/logging').logger(module)

module.exports = {
  method: 'PUT',
  path: '/create',
  middleware: [
    koaBody(),
    async function (ctx, next) {
      ctx.body = ctx.request.body
      await next()
    }
  ],
  async handler (ctx) {
    // TODO: Actually make the HTTP request to GitHub to create the webhook
    const webhookType = ctx.body.type

    if (!webhookType) {
      const error = `"type" field required in request`
      logger.error(error)
      ctx.throw(400, error)
      return
    }

    let modelType = WebhookType[webhookType]

    if (!modelType) {
      const error = `Invalid "type" field provided: ${webhookType}`
      logger.error(error)
      ctx.throw(400, error)
      return
    }

    try {
      await dao.insert(modelType)
    } catch (err) {
      const error = `Error occurred while attempting to insert a new webhook ` +
        `into the database with type: ${webhookType}`
      logger.error(error)
      ctx.throw(500, error)
    }
  }
}
