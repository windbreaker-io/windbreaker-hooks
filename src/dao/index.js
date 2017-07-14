const { createDao } = require('windbreaker-service-util/dao')
const Webhook = require('~/src/models/Webhook')
const logger = require('~/src/logging').logger(module)
const config = require('~/src/config')

let daoHelper

exports.createDao = function () {
  daoHelper = createDao({
    modelType: Webhook,
    logger,
    knexConfig: config.getKnex()
  })
}

exports.close = async function () {
  return daoHelper.close()
}
