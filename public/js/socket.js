var socket = io()
socket.on('connect', () => {
  console.log('Connected to sever')
  socket.emit('createMessage', {
    from: 'sohail_client',
    message: 'hi bro',
    createdAt: new Date().toString()
  })
})
socket.on('disconnect', () => {
  console.log('Disconnect from server')
})
socket.on('newMessage', data => {
  console.log(data)
})
