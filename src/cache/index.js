const { createCache } = require('windbreaker-service-util/cache')
const logger = require('~/src/logging').logger(module)
const config = require('~/src/config')

const CONNECTION_OPTIONS = {
  nodes: config.getRedisClusterNodes(),
  logger,
  maxDelay: 1000
}

let cache

exports.createCache = async function () {
  logger.info('Attempting to connect to Redis Cluster Nodes')
  cache = exports.cache = await createCache(CONNECTION_OPTIONS)
}

exports.close = async function () {
  return cache.close()
}

exports.getEntity = async function (key, ModelType) {
  return cache.getEntity(key, ModelType)
}

exports.setEntity = async function (key, value, ttl) {
  return cache.setEntity(key, value, ttl)
}
