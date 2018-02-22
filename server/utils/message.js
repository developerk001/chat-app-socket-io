const getMessage = (from, message) => {
  return {
    from,
    message,
    createdAt: new Date().getTime()
  }
}
const getLocationLink = (from, lat, lng) => {
  return {
    from,
    link: `https://maps.google.com/?q=${lat},${lng}`,
    createdAt: new Date().getTime()
  }
}
module.exports = {getMessage, getLocationLink}
