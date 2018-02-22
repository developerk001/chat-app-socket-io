const expect = require('expect')
const {getMessage, getLocationLink} = require('./message');
describe('generate message', () => {
  it('should generate the correct message', () => {
    var from = 'Admin'
    var msg = 'Hey, There'
    var message = getMessage(from, msg)
    expect(typeof message.createdAt).toBe('number')
    expect(message.message).toBe(msg)
    expect(message.from).toBe(from)
    // expect(message).objectInclude({from, msg})
  })
});
describe('generate Location link', () => {
  it('should generate location link with lat and lng', () => {
    let from = 'Admin'
    let lat = 4
    let lng = 5
    const link = getLocationLink(from, lat, lng)
    expect(typeof link.createdAt).toBe('number')
    expect(link.from).toBe(from)
    expect(link.link).toBe(`https://maps.google.com/?q=${lat},${lng}`)
  })
});
