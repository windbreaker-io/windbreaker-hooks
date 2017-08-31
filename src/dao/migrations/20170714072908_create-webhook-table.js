const logger = require('../../logging').logger(module)
const Webhook = require('../../models/Webhook')

const WEBHOOK_TABLE_NAME = Webhook.typeName

exports.up = function (knex, Promise) {
  logger.info('Attempting to run "up" on "1-create-webhook-table"')
  logger.info('Attempting to create webhook table with table name: ', WEBHOOK_TABLE_NAME)

  return knex
    .schema
    .createTableIfNotExists(WEBHOOK_TABLE_NAME + require('uuid').v4(), (table) => {
      // TODO: Add more as more properties are added
      // to the Webhook model
      table.string('id').primary()
      table.string('type')
      table.timestamp('created_at')
    })
}

// This is required by Knex
exports.down = function (knex, Promise) {}
