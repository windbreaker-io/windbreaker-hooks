const GithubPush = require('windbreaker-service-util/models/events/webhook/github/GithubPush')
const producer = require('~/src/producer')
const getWebhookMiddleware = require('~/src/http-server/util/getWebhookMiddleware')
const WebhookType = require('~/src/models/WebhookType')
const logger = require('~/src/logging').logger(module)

const eventToModelType = {
  push: GithubPush
}

const EVENT_HEADER = 'x-github-event'

module.exports = {
  method: 'POST',
  path: '/github/:id',
  middleware: getWebhookMiddleware(WebhookType.GITHUB),
  async handler (ctx) {
    const id = ctx.params.id
    const event = ctx.request.header[EVENT_HEADER]

    logger.info(`Received GitHub event "${event}" with ID ${id}`)

    if (!event) {
      logger.error('Missing event header in GitHub webhook')
      ctx.throw(400, 'Missing event header')
      return
    }

    const ModelType = eventToModelType[event]

    if (!ModelType) {
      logger.error(`Invalid event header ${event}`)
      ctx.throw(400, 'Invalid event header')
      return
    }

    let errors = []
    let webhookEvent = ModelType.wrap(ctx.body, errors)

    if (errors.length) {
      // It's possible that the webhook provider has changed their payload.
      // Most likely they've added a new field, which will cause model wrapping
      // to complain. Simply `warn`, so that we are aware of the changes that
      // are being made and continue doing work.
      logger.warn(`Invalid event body "${webhookEvent.stringify()}". Errors: "${errors.join(',')}"`)
    }

    await producer.sendMessage(webhookEvent)
  }
}
