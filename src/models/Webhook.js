/**
* Model for Webhooks stored in the databases
* __WHEN MODIFIYING THIS FILE__: Update `~/src/dao/migrations` migrations to
* reflect the schema changes.
*/
const WebhookType = require('./WebhookType')

module.exports = require('windbreaker-service-util/models/Model').extend({
  typeName: 'webhook',
  properties: {
    id: String,
    type: WebhookType,
    created_at: Date
  }
})
