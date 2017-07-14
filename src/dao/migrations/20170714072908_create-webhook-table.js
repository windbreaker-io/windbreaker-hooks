const daoHelper = require('~/src/dao')
const logger = require('~/src/logging').logger(module)

const tableName = daoHelper.getTableName()

exports.up = function (knex, Promise) {
  logger.info('Attempting to run the "1-create-webhook-table" test')

  return Promise.all([
    knex
      .schema
      .createTableIfNotExists(tableName, (table) => {
        // TODO: Add more as more properties are added
        // to the Webhook model
        table.string('id').primary()
      })
  ])
}
