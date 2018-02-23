var socket = io()
function scroll() {
  let messages = $("#messages")
  let newMessage = messages.children('li:last-child')
  let newMessageHeight = newMessage.innerHeight()
  let lasMessageHeight = newMessage.prev().innerHeight()
  let cH = messages.prop('clientHeight')
  let sT = messages.prop('scrollTop')
  let sH = messages.prop('scrollHeight')
  if (cH + sT + newMessageHeight + lasMessageHeight >= sH) {
    messages.scrollTop(sH)
  }
}
socket.on('connect', () => {
  console.log('Connected to sever')
})
socket.on('disconnect', () => {
  console.log('Disconnect from server')
})
socket.on('newMessage', msg => {
  let time = moment(msg.createdAt).format('h:mm a')
  let template = $('#message-template').html()
  let html = Mustache.render(template, {
    message: msg.message,
    from: msg.from,
    createdAt: time
  })
  $('#messages').append(html)
  scroll()
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
  let time = moment(msg.createdAt).format('h:mm a')
  let template = $('#location-message-template').html()
  let html = Mustache.render(template, {
    from: msg.from,
    createdAt: time,
    link: msg.link
  })
  $('#messages').append(html)
  scroll()
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
