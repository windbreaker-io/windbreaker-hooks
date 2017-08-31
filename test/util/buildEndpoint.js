module.exports = function buildEndpoint (id, type, httpServerPort) {
  return `:${httpServerPort}/${type.toLowerCase()}/${id}`
}
