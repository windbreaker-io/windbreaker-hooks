const GithubPush = require('windbreaker-service-util/models/events/webhook/github/GithubPush')
// const validateRequestId = require('~/src/util/dao/validateRequestId')
const logger = require('~/src/logging').logger(module)
const producer = require('~/src/producer')
const getWebhookMiddleware = require('~/src/http-server/util/getWebhookMiddleware')

const eventToModelType = {
  push: GithubPush
}

const EVENT_HEADER = 'x-github-event'

module.exports = {
  method: 'POST',
  path: '/github/:id',
  middleware: getWebhookMiddleware(),
  async handler (ctx) {
    const event = ctx.request.header[EVENT_HEADER]

    if (!event) {
      logger.error('Missing event header in GitHub webhook')
      ctx.throw(400, 'Missing event header')
      return
    }

    const id = ctx.params.id
    logger.info(`Received GitHub event "${event}" with ID ${id}`)

    const ModelType = eventToModelType[event]

    if (!ModelType) {
      logger.error(`Invalid event header ${event}`)
      ctx.throw(400, 'Invalid event header')
      return
    }

    let errors = []
    let webhookEvent = ModelType.wrap(ctx.body, errors)

    if (errors.length) {
      logger.error(`Invalid event body "${webhookEvent.stringify()}". Errors: "${errors.join(',')}"`)
      ctx.throw(400, 'Invalid event body')
      return
    }

    await producer.sendMessage(webhookEvent)
  }
}
