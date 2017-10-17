const GithubPush = require('windbreaker-service-util/models/events/webhook/github/GithubPush')
const Installation = require('windbreaker-service-util/models/events/webhook/github/Installation')
const logger = require('~/src/logging').logger(module)
const producer = require('~/src/producer')
const githubMiddleware = require('./middleware')

const eventToModelType = {
  push: GithubPush,
  installation: Installation
}

const EVENT_HEADER = 'x-github-event'

module.exports = {
  method: 'POST',
  path: '/github',
  middleware: [ githubMiddleware ],
  async handler (ctx) {
    const event = ctx.request.header[EVENT_HEADER]

    logger.info(`Received GitHub event "${event}"`)

    if (!event) {
      logger.error('Missing event header in GitHub webhook')
      ctx.throw(400, 'Missing event header')
    }

    const ModelType = eventToModelType[event]

    if (!ModelType) {
      logger.error(`Invalid event header ${event}`)
      ctx.throw(400, 'Invalid event header')
    }

    let errors = []
    let webhookEvent = ModelType.wrap(ctx.request.body, errors)

    if (errors.length) {
      logger.error(`Invalid event body "${webhookEvent.stringify()}". Errors: "${errors.join(',')}"`)
      ctx.throw(400, 'Invalid event body')
    }

    await producer.sendMessage(webhookEvent)

    ctx.body = {}
  }
}
