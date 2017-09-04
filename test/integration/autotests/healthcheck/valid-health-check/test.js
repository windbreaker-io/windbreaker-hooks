exports.description = 'should handle valid healthcheck request'
exports.type = 'healthcheck'

exports.request = function ({ request, id, httpServerPort, endpoint, payload }) {
  return request
    .get(endpoint)
}
