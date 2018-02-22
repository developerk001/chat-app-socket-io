const moment = require('moment')
const getMessage = (from, message) => {
  return {
    from,
    message,
    createdAt: moment().valueOf()
  }
}
const getLocationLink = (from, lat, lng) => {
  return {
    from,
    link: `https://maps.google.com/?q=${lat},${lng}`,
    createdAt: moment().valueOf()
  }
}
module.exports = {getMessage, getLocationLink}
