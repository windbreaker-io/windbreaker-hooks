const server = require('~/src/server')
const getPortSync = require('get-port-sync')
const startupTasks = require('~/src/startup-tasks')

exports.register = function ({ test, context }) {
  let httpServerPort

  try {
    console.log('Attempting to obtain a random port to start the test HTTP server on...')
    httpServerPort = getPortSync()
    console.log('Successfully obtained port: ', httpServerPort)
    context.httpServerPort = httpServerPort
  } catch (err) {
    console.error('Could not get random port: ', err)
    throw err
  }

  test.before(async (t) => {
    console.log('Attempting to start test server...')
    await server.start({ httpServerPort })
    console.log('Successfully started test server')
  })

  test.after(async () => {
    await startupTasks.stopAll()
  })
}
