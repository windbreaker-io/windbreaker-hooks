const buildEndpoint = require('~/test/util/buildEndpoint')

exports.description = 'should receive 400 error when requesting with an invalid webhook id'
exports.expectError = true
const type = exports.type = 'GITHUB'

exports.request = function ({ request, id, httpServerPort, endpoint, payload }) {
  return request
    .post(buildEndpoint({ id: 'INVALID-ID', type, httpServerPort }))
    .set('x-github-event', 'push')
    .send(payload)
}
