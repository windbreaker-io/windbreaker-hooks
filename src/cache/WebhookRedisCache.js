const cache = require('./')
const logger = require('~/src/logging').logger(module)
const Webhook = require('~/src/models/Webhook')

class WebhookRedisCache {
  async get (key, options) {
    let result

    try {
      result = await cache.getEntity(key, Webhook)
    } catch (err) {
      logger.error(`Error while fetching key "${key}"`, err)
    }
    return result
  }

  async set (key, value, options) {
    try {
      await cache.setEntity(key, value)
    } catch (err) {
      logger.error(`Error while setting key "${key}"`, err)
    }
  }
}

module.exports = WebhookRedisCache
