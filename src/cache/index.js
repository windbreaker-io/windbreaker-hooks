const { createCache } = require('windbreaker-service-util/cache')
const logger = require('~/src/logging').logger(module)
const Webhook = require('~/src/models/Webhook')

const CONNECTION_OPTIONS = {
  nodes: [
    { host: 'rediscluster' }
  ],
  logger,
  maxDelay: 1000
}

let cache

exports.initialize = async function () {
  cache = await createCache(CONNECTION_OPTIONS)
}

exports.close = async function () {
  // TODO
}

exports.getWebhook = async function (key) {
  let result

  try {
    result = await cache.getEntity(key, Webhook)
  } catch (err) {
    logger.error(`Error while fetching key "${key}"`, err)
  }
  return result
}
