const tri = require('tri')
const asyncQueue = require('queue')
const config = require('~/src/config')
const logger = require('~/src/logging').logger(module)
const queue = require('windbreaker-service-util/queue')
const Event = require('windbreaker-service-util/models/events/Event')

const AMQ_URL = config.getAmqUrl()
const WEBHOOKS_EVENTS_QUEUE_NAME = config.getWebhookEventsQueueName()

const CONNECT_PRODUCER_ATTEMPT_OPTIONS = {
  maxAttempts: 5,
  delay: 200,
  factor: 2,
  jitter: true,
  logger
}

async function _sendMessage (event) {
  try {
    logger.info('Attempting to send message')
    await producer.sendMessage(event)
    logger.info('Successfully sent message')
  } catch (err) {
    logger.error(`Failed to send message "${event}" to queue name "${WEBHOOKS_EVENTS_QUEUE_NAME}"`, err)
  }
}

let eventQueue = asyncQueue()
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

  producer.on('error', async function (err) {
    logger.error(`Producer error: `, err)

    try {
      await startProducer()
    } catch (err) {
      // TODO: Write test to ensure that this bubbles up to an uncaught exception
      logger.error('Error attempting to reconnect producer: ', err)
      throw err
    }

    // Check whether there are pending jobs to be executed in the queue. This
    // will only happen if the producer was restarted and there were messages
    // that needed to be sent while it was down
    if (!eventQueue.length) {
      return
    }

    try {
      await new Promise(function (resolve, reject) {
        eventQueue.start(function (err) {
          return err ? reject(err) : resolve()
        })
      })
    } catch (err) {
      eventQueue.end()
      logger.error('Error while executing jobs in the queue', err)
    }
  })
}

exports.sendMessage = async function (message) {
  const typeName = message.Model.typeName
  let errors = []

  const event = Event.wrap({
    type: typeName,
    data: message.clean()
  }, errors)

  if (errors.length) {
    logger.error(`Could not wrap event to send. Errors: "${errors.join(',')}"`)
    return
  }

  // If the producer is falsy, it is currently offline. We should add messages
  // to an async queue and handle when it's back online
  if (!producer) {
    eventQueue.push(async function (callback) {
      try {
        await _sendMessage(event)
      } catch (err) {
        logger.error(`Failed to send message "${event.stringify()}" on async queue`, err)
      }

      // Do not report errors. If the message failed to send, we've already retried
      // multiple times. We should just give up.
      callback()
    })
    return
  }

  try {
    logger.info('Attempting to send message')
    await producer.sendMessage(event)
    logger.info('Successfully sent message')
  } catch (err) {
    logger.error(`Failed to send message "${event}" to queue name "${WEBHOOKS_EVENTS_QUEUE_NAME}"`, err)
  }
}

exports.stop = async function () {
  await producer.stop()
}
