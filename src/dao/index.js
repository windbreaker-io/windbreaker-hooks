const path = require('path')
const Webhook = require('~/src/models/Webhook')
const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const { createDaoHelper } = require('windbreaker-service-util/dao')

let daoHelper

exports.createDao = function () {
  daoHelper = createDaoHelper({
    modelType: Webhook,
    logger,
    knexConfig: config.getKnex()
  })
}

exports.migrate = function () {
  logger.info('Attempting to run database migrations...')
  return daoHelper.getKnex().migrate.latest({
    tableName: config.getWebhookMigrationsTableName(),
    directory: path.join(__dirname, 'migrations')
  })
}

exports.close = async function () {
  return daoHelper.close()
}
