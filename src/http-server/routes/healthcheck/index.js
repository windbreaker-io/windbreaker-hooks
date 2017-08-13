module.exports = {
  method: 'GET',
  path: '/healthcheck/:id',
  async handler (ctx) {
    ctx.body = 'Okay!'
  }
}
