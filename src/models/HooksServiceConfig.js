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
    githubWebhookSecretPath: {
      type: String,
      description: 'path to file containing a shared secret for verifying github payloads',
      default: function () {
        throw new Error('path to github webhook secret key must be provided!')
      }
    },
    githubWebhookSecret: {
      type: String,
      description: 'shared secret for verifying github payloads',
      default: function () {
        const path = require.resolve(this.getGithubWebhookSecretPath())
        return fs.readFileSync(path, 'utf-8').trim()
      }
    }
  }
})
