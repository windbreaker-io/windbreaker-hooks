module.exports = {
  method: 'GET',
  path: '/healthcheck',
  async handler (ctx) {
    // TODO: Add more healthchecks
    ctx.body = {}
  }
}
