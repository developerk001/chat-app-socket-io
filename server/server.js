const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '/../public')
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const {getMessage} = require('./utils/message');

app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('new user connected')
  socket.emit('newMessage', getMessage('Admin', 'Welcome to chat app'))
  socket.broadcast.emit('newMessage', getMessage('Admin', 'New User Joined'))
  socket.on('disconnect', () => {
    console.log('Client Disconnected')
  })
  socket.on('createMessage', message => {
    io.emit('newMessage', getMessage(message.from, message.message))
    // socket.broadcast.emit('newMessage', {
    //   from: msg.from,
    //   msg: msg.message,
    //   createdAt: new Date().toString()
    // })
  })
})

server.listen(port, () => {
  console.log('Server is running on port ' + port)
})
