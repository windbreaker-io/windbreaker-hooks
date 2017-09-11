const BaseConfig = require('windbreaker-service-util/models/BaseServiceConfig')
const DefaultsMixin = require('fashion-model-defaults')
const RedisClusterNodeConfig = require('windbreaker-service-util/models/cache/RedisClusterNodeConfig')
const KnexConfig = require('windbreaker-service-util/models/dao/KnexConfig')
const fs = require('fs')

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
    knex: KnexConfig,
    redisClusterNodes: [RedisClusterNodeConfig],
    webhookEventsQueueName: {
      description: 'The name of the queue in which webhook events are published on',
      default: 'events'
    },
    githubWebhookSecret: {
      type: String,
      description: 'path to file containing a shared secret for verifying github payloads',
      default: function () {
        let path
        try {
          path = require.resolve('~/.secrets/github-hooks-secret')
        } catch (err) {}
        return path ? fs.readFileSync(path, 'utf8').trim() : 'superSecret'
      }
    }
  }
})
