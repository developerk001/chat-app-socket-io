const expect = require('expect')
const {getMessage} = require('./message');
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
