const tri = require('tri')
const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const queue = require('windbreaker-service-util/queue')

const AMQ_URL = config.getAmqUrl()
const WEBHOOKS_EVENTS_QUEUE_NAME = config.getWebhookEventsQueueName()

const CONNECT_PRODUCER_ATTEMPT_OPTIONS = {
  maxAttempts: 5,
  delay: 200,
  factor: 2,
  jitter: true,
  logger
}

let producer

async function startProducer (attempts) {
  try {
    producer = await tri(async () => {
      return queue.createProducer({
        logger,
        amqUrl: AMQ_URL,
        producerOptions: {
          queueName: WEBHOOKS_EVENTS_QUEUE_NAME
        }
      }, CONNECT_PRODUCER_ATTEMPT_OPTIONS)
    })
  } catch (err) {
    logger.error('Error attempting to connect to webhooks producer: ', err)
    throw err
  }
}

exports.initialize = async function () {
  logger.info('Attempting to start webhook event producer...')

  await startProducer()

  logger.info('Sucessfully started webhook event producer!')

  producer.on('error', (err) => {
    logger.error(`Producer error: `, err)

    // TODO: Write test to ensure that this bubbles up to an uncaught exception

    startProducer()
      // .then(() => {
      // TODO: Handle all messages in async queue here  
      // })
      .catch((err) => {
        logger.error('Error attempting to reconnect producer: ', err)
        throw err
      })
  })
}

exports.sendMessage = async function (message) {
  // TODO: If the producer is falsy, add the message  to an async queue
  // and handle it when the producer is back online
  try {
    await producer.sendMessage(message)
  } catch (err) {
    logger.error(`Failed to send message "${message}" to queue name "${WEBHOOKS_EVENTS_QUEUE_NAME}"`, err)
  }
}
