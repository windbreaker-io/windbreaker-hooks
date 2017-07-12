require('require-self-ref')

require('~/src/config').load()

const startupTasks = require('~/src/startup-tasks')

;(async function () {
  try {
    await startupTasks.startAll()

    const logger = require('~/src/logging').logger(module)
    const config = require('~/src/config')

    logger.info(`Started all tasks in environment ${config.getEnvironment().name()}`)
  } catch (err) {
    console.log('Failed to start server: ', err)
    return process.exit(1)
  }
})()

process.on('uncaughtException', function (err) {
  // TODO: Log this to a database
  console.error('Uncaught exception: ', err)
  process.exit(1)
})

process.on('unhandledException', function (err) {
  // TODO: Log this to a database
  console.error('Unhandled exception', err)
  process.exit(1)
})
