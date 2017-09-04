module.exports = {
  start () {
    return require('../cache').createCache()
  },
  stop () {
    return require('../cache').close()
  }
}
