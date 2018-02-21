var socket = io()
socket.on('connect', () => {
  console.log('Connected to sever')
})
socket.on('disconnect', () => {
  console.log('Disconnect from server')
})
socket.on('newMessage', msg => {
  console.log(msg)
})
