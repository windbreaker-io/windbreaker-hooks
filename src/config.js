const configUtil = require('windbreaker-service-util/config')
const path = require('path')

const HooksServiceConfig = require('~/src/models/HooksServiceConfig')
const config = module.exports = new HooksServiceConfig()

const configDirectoryPath = path.join(__dirname, '../config')

function applyConfigOptions (configOps) {
  for (const configOp in configOps) {
    const value = configOps[configOp]
    config.set(configOp, value)
  }
}

module.exports.load = (configOps) => {
  if (configOps) applyConfigOptions(configOps)
  configUtil.load({ config, path: configDirectoryPath })
}
