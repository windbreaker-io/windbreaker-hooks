module.exports = function buildEndpoint ({ id, type, httpServerPort }) {
  let endpoint = `:${httpServerPort}/${type.toLowerCase()}`

  if (id) {
    endpoint += `/${id}`
  }

  return endpoint
}
