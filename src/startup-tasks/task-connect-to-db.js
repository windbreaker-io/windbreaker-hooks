module.exports = {
  start () {
    return require('../dao').createDao()
  },
  stop () {
    return require('../dao').close()
  }
}
