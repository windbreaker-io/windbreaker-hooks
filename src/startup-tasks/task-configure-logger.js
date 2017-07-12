module.exports = {
  name: 'configure-logger',

  start () {
    const config = require('~/src/config')
    const projectPackage = require('~/package.json')

    require('../logging')
      .configure({
        packagePath: require.resolve('~/package.json'),
        logLevel: config.getLogLevel(),
        loggerName: projectPackage.name
      })
  }
}
