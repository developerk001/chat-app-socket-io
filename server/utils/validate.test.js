const expect = require('expect')
const {isString} = require('./validate')
describe('string validation', () => {
  it('shoud reject non string', () => {
    var result = isString([1, 2])
    expect(result).toBe(false)
  })
  it('should reject to space only', () => {
    var result = isString('    ')
    expect(result).toBe(false)
  })
  it('shoud all string with non tailing and leading spaces', () => {
    var result = isString('developerk')
    expect(result).toBe(true)
  })
})
