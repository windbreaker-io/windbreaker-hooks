const BaseConfig = require('windbreaker-service-util/models/BaseServiceConfig')
const DefaultsMixin = require('fashion-model-defaults')

module.exports = BaseConfig.extend({
  mixins: [ DefaultsMixin ],

  properties: {
    httpServerPort: {
      description: 'Port to run the hooks HTTP server port on',
      type: Number,
      default: 8080
    },
    amqUrl: {
      description: 'The url used to access activeMQ',
      default: 'amqp://127.0.0.1:5672'
    },
    webhookEventsQueueName: {
      description: 'The name of the queue in which webhook events are published on',
      default: 'events'
    }
  }
})
