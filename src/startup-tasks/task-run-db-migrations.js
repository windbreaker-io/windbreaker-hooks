module.exports = {
  start () {
    return require('../dao').migrate()
  }
}
