const NLevelCache = require('n-level-cache')
const WebhookRedisCache = require('./WebhookRedisCache')
const dao = require('~/src/dao')

// TODO: Ensure that if the webhook is updated or deleted it gets purged
// from the cache and removed from the DB
const WebhookLayeredCache = new NLevelCache({
  caches: [WebhookRedisCache],
  hydrate: true,
  async compute (key) {
    return dao.findById(key)
  }
})

module.exports = WebhookLayeredCache
