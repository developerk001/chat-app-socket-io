const expect = require('expect')
const {Users} = require('./users')
describe('Users Test', () => {
  var users
  beforeEach(() => {
    users = new Users()
    users.users = [{
      id: 1,
      name: 'Johny',
      room: 'A'
    }, {
      id: 2,
      name: 'Mia',
      room: 'B'
    }, {
      id: 3,
      name: 'Archana',
      room: 'A'
    }]
  })
  it('should add a new uses', () => {
    var users = new Users()
    var user = {
      id: 123,
      name: 'developerk',
      room: 'developerk-room'
    }
    var userData = users.addUser(user.id, user.name, user.room)
    expect(users.users).toEqual([user])
  })
  it('should return names for room A', () => {
    var userList = users.getUsers('A')
    expect(userList).toEqual(['Johny', 'Archana'])
  })
  it('should return names for room B', () => {
    var userList = users.getUsers('B')
    expect(userList).toEqual(['Mia'])
  })
  it('should remove a user', () => {
    var user = users.removeUser(1)
    expect(user.length).toBe(2)
  })
  it('should not remove a user with unmatch id', () => {
    var user = users.removeUser(4)
    expect(user.length).toBe(3)
  })
  it('should find a user', () => {
    var user = users.getUser(1)
    expect(user[0].name).toBe('Johny')
  })
  it('shoud find not find a user with unmatch id', () => {
    var user = users.getUser(4)
    expect(user).toNotExists()
  })
});
