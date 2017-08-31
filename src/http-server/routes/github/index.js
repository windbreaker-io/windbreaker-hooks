const GithubPush = require('windbreaker-service-util/models/events/webhook/github/GithubPush')
const WebhookType = require('~/src/models/WebhookType')
const dao = require('~/src/dao')
const logger = require('~/src/logging').logger(module)
const producer = require('~/src/producer')
const getWebhookMiddleware = require('~/src/http-server/util/getWebhookMiddleware')

const eventToModelType = {
  push: GithubPush
}

const EVENT_HEADER = 'x-github-event'

async function _isValidWebhook (id) {
  try {
    let result = await dao.isValidWebhook(id, WebhookType.GITHUB)
    return result
  } catch (err) {
    logger.error(`Error validating webhook with id "${id}"`)
    return false
  }
}

module.exports = {
  method: 'POST',
  path: '/github/:id',
  middleware: getWebhookMiddleware(),
  async handler (ctx) {
    const id = ctx.params.id

    let isValidWebhook = await _isValidWebhook(id)

    if (!isValidWebhook) {
      logger.error(`Invalid webhook id "${id}" received in request`)
      ctx.throw(400, `Invalid webhook id "${id}" received in request`)
      return
    }

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
      logger.error(`Invalid event body "${webhookEvent.stringify()}". Errors: "${errors.join(',')}"`)
      ctx.throw(400, 'Invalid event body')
      return
    }

    await producer.sendMessage(webhookEvent)

    ctx.body = {}
  }
}
