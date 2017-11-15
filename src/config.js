const configUtil = require('windbreaker-service-util/config')
const path = require('path')

const HooksServiceConfig = require('~/src/models/HooksServiceConfig')
const config = module.exports = new HooksServiceConfig()

const configDirectoryPath = path.join(__dirname, '../config')

module.exports.load = function (overrides) {
  configUtil.load({
    config,
    path: configDirectoryPath,
    overrides
  })
}
