var socket = io()
socket.on('connect', () => {
  console.log('Connected to sever')
})
socket.on('disconnect', () => {
  console.log('Disconnect from server')
})
socket.on('newMessage', msg => {
  console.log(msg)
  $('#messages').append(`<li>${msg.from}: ${msg.message}</li>`)
})
$('#form').on('submit', e => {
  e.preventDefault()
  socket.emit('createMessage', {
    from: 'john',
    message: $('[name=message]').val()
  }, () => {

  })
})
