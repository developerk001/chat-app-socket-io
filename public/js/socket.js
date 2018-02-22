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
  $('[name=message]').val('')
})
$('#form').on('submit', e => {
  e.preventDefault()
  socket.emit('createMessage', {
    from: 'john',
    message: $('[name=message]').val()
  }, () => {

  })
})
socket.on('newLocation', msg => {
  $('#messages').append(`<li>${msg.from}: <a target="_blank" href="${msg.link}">My Location</a></li>`)
})
$('#location').on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation doesnot supported by your browser')
  }
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit('createLocation', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }, () => {
    alert('Unable to fetch location')
  })
})
