require('require-self-ref')

exports.start = async function (configOps) {
  const config = require('~/src/config')
  const startupTasks = require('~/src/startup-tasks')

  try {
    await config.load(configOps)
    require('~/src/logging').logger(module)

    await startupTasks.startAll()

    // notify browser refresh
    if (process.send) {
      process.send('online')
    }
  } catch (err) {
    console.error('Error occurred while performing startup tasks', err)
    process.exit(1)
  }

  process.on('uncaughtException', (err) => {
    console.error('UncaughtException', err)
  })

  process.on('unhandledException', (err) => {
    console.error('UnhandledException', err)
  })
}
