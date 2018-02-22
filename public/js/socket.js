var socket = io()
socket.on('connect', () => {
  console.log('Connected to sever')
})
socket.on('disconnect', () => {
  console.log('Disconnect from server')
})
socket.on('newMessage', msg => {
  var time = moment(msg.createdAt).format('h:mm a')
  $('#messages').append(`<li>${msg.from}: ${time} => ${msg.message}</li>`)
})
$('#form').on('submit', e => {
  e.preventDefault()
  if (!$('[name=message]').val() == '') {
    socket.emit('createMessage', {
      from: 'john',
      message: $('[name=message]').val()
    }, () => {
      $('[name=message]').val('')
    })
  }
})
socket.on('newLocation', msg => {
  var time = moment(msg.createdAt).format('h:mm a')
  $('#messages').append(`<li>${msg.from}: ${time} => <a target="_blank" href="${msg.link}">My Location</a></li>`)
})
$('#location').on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation doesnot supported by your browser')
  }
  $('#location').attr('disabled', 'disabled').text('Sending Location..')
  navigator.geolocation.getCurrentPosition(position => {
    $('#location').removeAttr('disabled').text('Send Location')
    socket.emit('createLocation', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }, () => {
    $('#location').removeAttr('disabled').text('Send Location')
    alert('Unable to fetch location')
  })
})
