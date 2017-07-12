module.exports = {
  start () {
    return require('../cache').initialize()
  },
  stop () {
    require('../cache').close()
  }
}
