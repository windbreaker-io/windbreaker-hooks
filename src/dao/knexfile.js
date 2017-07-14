require('require-self-ref')

const config = require('~/src/config')

if (!config.getEnvironment()) {
  require('~/src/config').load()
}

const environment = config.getEnvironment().name().toLowerCase()

let exported = {}
exported[environment] = config.getKnex().clean()

module.exports = exported
