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
const {isValidString} = require('./utils/validate')
const {Users} = require('./utils/users')
var users = new Users()
var rooms = []

app.use(express.static(publicPath))
io.on('connection', socket => {
  console.log('new user connected')

  // New User Joins
  socket.on('join', (info, callback) => {
    if (!rooms.includes(info.room)) {
      rooms.push(info.room)
    }
    socket.emit('rooms', rooms)
    var activeUsers = users.getUsers(info.room)
    if(activeUsers.includes(info.name)) {
      return callback('User Already Exists')
    }
    if (!(activeUsers.filter(user => info.name === user.name))) {
      return callback(`user with ${info.name} already exists.`)
    }
    if (!isValidString(info.name) || !isValidString(info.room)) return callback('Both name and room are required')
    socket.join(info.room)
    users.addUser(socket.id, info.name, info.room)
    io.to(info.room).emit('updatePeoples', users.getUsers(info.room))
    socket.emit('newMessage', getMessage('Admin', 'Welcome to chat app'))
    socket.broadcast.to(info.room).emit('newMessage', getMessage('Admin', info.name + ' has Joined'))
    callback()
  })

  // Send Message to all clients
  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id)
    if (user && isValidString(message.message)) {
      io.to(user.room).emit('newMessage', getMessage(user.name, message.message))
    }
    callback()
  })

  // Create Location
  socket.on('createLocation', location => {
    var user = users.getUser(socket.id)
    if (user) {
      io.to(user.room).emit('newLocation', getLocationLink(user.name, location.lat, location.lng))
    }
  })

  // When User disconnects
  socket.on('disconnect', () => {
    var disconnectedUser = users.getUser(socket.id)
    io.of('/chat').in(disconnectedUser.room).clients((error, clients) => {
      if (error) {
        return error
      }
      if (clients.length === 0) {
        rooms = rooms.filter(room => room !== disconnectedUser.room)
      }
    })
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
