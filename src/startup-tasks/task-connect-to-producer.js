module.exports = {
  start () {
    return require('../producer').initialize()
  },
  stop () {
    require('../producer').stop()
  }
}
