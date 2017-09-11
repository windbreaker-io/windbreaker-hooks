const path = require('path')
const uuid = require('uuid')
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

exports.migrate = async function () {
  logger.info('Attempting to run database migrations...')
  return daoHelper.getKnex().migrate.latest({
    tableName: config.getKnex().migrations.tableName,
    directory: path.join(__dirname, 'migrations')
  })
}

/**
* Create a new webhook record in the database
* @param type {WebhookType} - Type of webhook to create
*/
exports.insert = async function (id, type) {
  id = id || uuid.v4()
  return daoHelper.insert({ id, type })
}

exports.deleteById = async function (id) {
  return daoHelper.deleteById(id)
}

exports.findById = async function (id) {
  return daoHelper.findById(id)
}

/**
* Validate whether a webhook with a specific ID exists
*
* @param id {String} - UUID of the webhook passed in the path of the request
* @param type {WebhookType} - Type of webhook associated with this request
*/
exports.isValidWebhook = async function (id, type) {
  try {
    const webhook = await daoHelper.findById(id)
    return webhook != null && webhook.getType() === type
  } catch (err) {
    logger.error(`Error validating webhook with id "${id}"`, err)
    return false
  }
}

exports.close = async function () {
  return daoHelper.destroy()
}
