module.exports = {
  name: 'configure-http-server',

  start () {
    return require('~/src/http-server').create()
  }
}
