let socket, room

const username = document.getElementById('username')
const inputRoom = document.getElementById('room')
const btnConnect = document.getElementById('connect')
const outputArea = document.getElementById('output')
const inputArea = document.getElementById('input')
const btnSend = document.getElementById('send')
socket = io('https://localhost')
btnConnect.onclick = () => {
  // connect
  room = inputRoom.value

  if (btnConnect.textContent === 'Conect') {
    btnConnect.textContent = 'Leave'

    socket.on('joined', (room, id, username) => {
      inputArea.disabled = false
      btnSend.disabled = false
    })

    socket.on('new_joined_user', (username) => {
      const joinMessage = `${username} join this room!`
      outputArea.value = outputArea.value + joinMessage + '\r'
    })

    socket.on('leaved', (room, id) => {
      console.log('leaved room: ', room)
      inputArea.disabled = true
      btnSend.disabled = true
      username.value = ''
      inputRoom.value = ''
      outputArea.value = ''
    })

    socket.on('leaved_user', (username) => {
      const leaveMessage = `${username} leaved this room!`
      outputArea.value = outputArea.value + leaveMessage + '\r'
    })

    socket.on('message', (room, id, data) => {
      outputArea.value = outputArea.value + data + '\r'
    })

    socket.emit('join', room, username.value)
  } else {
    btnConnect.textContent = 'Conect'
    socket.emit('leaved', room, username.value)
  }
}

btnSend.onclick = () => {
  const data = `${username.value}: ${inputArea.value}`
  socket.emit('message', room, data)
  inputArea.value = ''
}
