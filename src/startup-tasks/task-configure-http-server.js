module.exports = {
  name: 'configure-http-server',

  start () {
    return require('~/src/http-server').create()
  },

  stop () {
    return require('~/src/http-server').close()
  }
}
