const fs = require('fs')
const path = require('path')
const yml = require('js-yaml')
const registerConfig = require('windbreaker-service-util/config')
const BaseServiceConfig = require('windbreaker-service-util/models/BaseServiceConfig')
const Config = require('~/src/models/HooksServiceConfig')

let config = module.exports = new Config()

const currentEnvironment = BaseServiceConfig.getServiceEnvironment() || 'development'
const configFilePath = path.resolve(__dirname, `config.${currentEnvironment}.yml`)
const configFile = yml.safeLoad(fs.readFileSync(configFilePath))

registerConfig(config, [
  // TODO: Add config from process.argv
  configFile
])
