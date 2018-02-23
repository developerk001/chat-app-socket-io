const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '/../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const {getMessage, getLocationLink} = require('./utils/message')
const {isString} = require('./utils/validate')
const {Users} = require('./utils/users')
var users = new Users()

app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('new user connected')

  // New User Joins
  socket.on('join', (info, callback) => {
    if (!isString(info.name) || !isString(info.room)) return callback('Both name and room are required')
    socket.join(info.room)
    users.addUser(socket.id, info.name, info.room)
    io.to(info.room).emit('updatePeoples', users.getUsers(info.room))
    socket.emit('newMessage', getMessage('Admin', 'Welcome to chat app'))
    socket.broadcast.to(info.room).emit('newMessage', getMessage('Admin', info.name + ' has Joined'))
    callback()
  })

  // Send Message to all clients
  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', getMessage(message.from, message.message))
    callback()
  })

  // Create Location
  socket.on('createLocation', location => {
    io.emit('newLocation', getLocationLink('Admin', location.lat, location.lng))
  })

  // When User disconnects
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id)
    if (user) {
      io.to(user.room).emit('updatePeoples', users.getUsers(user.room))
      io.to(user.room).emit('newMessage', getMessage('Admin', `${user.name} has left that chat`))
    }
  })
})

server.listen(port, () => {
  console.log('Server is running on port ' + port)
})
