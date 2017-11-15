module.exports = {
  description: 'should handle valid healthcheck request',
  request (t) {
    const { request, endpoint } = t.context
    return request.get(endpoint)
  }
}
