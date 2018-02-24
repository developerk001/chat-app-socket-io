var socket = io()

// For autoscrolling
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

// when user connects to server
socket.on('connect', () => {
  socket.emit('join', $.deparam(window.location.search), err => {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
    }
  })
})

// when user disconnects to ther server
socket.on('disconnect', () => {
  console.log('Disconnect from server')
})

// to update online peoples
socket.on('updatePeoples', users => {
  var ol = $('<ol></ol>')
  users.forEach(name => {
    ol.append(`<li>${name}</li>`)
  })
  $('#users').html(ol)
})

// receive message and append to chats
socket.on('newMessage', msg => {
  let time = moment(msg.createdAt).format('h:mm a')
  // let template = $('#message-template').html()
  // let html = Mustache.render(template, {
  //   message: "<p>hello</p>",
  //   from: msg.from,
  //   createdAt: time
  // })
  let style = ''
  if (msg.from === $.deparam(window.location.search).name) {
    style = `style="float: right;"`
  }
  $('#messages').append(`
    <li class="message clear"${style}>
      <div class="message__title">
        <h4>${msg.from}</h4>
        <span>${time}</span>
      </div>
      <div class="message__body">
        <p>${msg.message}</p>
      </div>
    </li>
    `)
  scroll()
})

// Receive location and append to chats
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

// Sending message via jQuery
$('#form').on('submit', e => {
  e.preventDefault()
  socket.emit('createMessage', {
    message: $('[name=message]').val()
  }, () => {
    $('[name=message]').val('')
  })
})

// Sending location via jQuery
$('#location').on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation doesnot supported by your browser')
  }
  $('#location').attr('disabled', 'disabled').text('Sending Location..')
  navigator.geolocation.getCurrentPosition(position => {
    $('#location').removeAttr('disabled').text('Send Location')

    // Emmitting location
    socket.emit('createLocation', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }, () => {
    $('#location').removeAttr('disabled').text('Send Location')
    alert('Unable to fetch location')
  })
})
