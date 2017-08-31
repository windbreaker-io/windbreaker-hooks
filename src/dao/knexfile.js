require('require-self-ref')
const config = require('~/src/config')

config.loadSync()

const environment = config.getEnvironment().name().toLowerCase()

let exported = {}
exported[environment] = Object.assign(config.getKnex().clean(), {
  migrations: {
    tableName: config.getWebhookMigrationsTableName()
  }
})

module.exports = exported
