const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const serveIndex = require('serve-index')
const socketIo = require('socket.io')
const log4js = require('log4js')

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'app.log',
      layout: {
        type: 'pattern',
        pattern: '%d %p %c %m%n',
      },
    },
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'debug',
    },
  },
})

const logger = log4js.getLogger()
const app = express()

app.use(serveIndex('./public'))
app.use(express.static('./public'))

const httpServer = http.createServer(app)
httpServer.listen(80, '0.0.0.0')

const options = {
  key: fs.readFileSync('./cert/localhost-key.pem'),
  cert: fs.readFileSync('./cert/localhost.pem'),
}
const httpsServer = https.createServer(options, app)

// socket.io with https binding
const io = socketIo.listen(httpsServer)

io.sockets.on('connection', (socket) => {
  // 加入房間
  socket.on('join', (room, username) => {
    socket.join(room)
    const myRoom = io.sockets.adapter.rooms[room]
    if (myRoom) {
      const users = Object.keys(myRoom.sockets).length

      logger.info(`the number of user in room is: ${users}`)

      // 只發送給當前加入的房間用戶
      socket.emit('joined', room, socket.id)

      // 發送給當前房間的所有人, 除了自己以外
      socket.to(room).emit('new_joined_user', username)

      // 發送給當前房間的所有人, 包含自己
      // io.in(room).emit('joined', room, socket.id)

      // 發送給網站全部的人, 除了自己以外
      // socket.broadcast.emit('joined', room, socket.id)
    }
  })

  // 離開房間
  socket.on('leaved', (room, username) => {
    const myRoom = io.sockets.adapter.rooms[room]
    if (myRoom) {
      const users = Object.keys(myRoom.sockets).length

      console.log('users', users - 1)
      logger.info(`the number of user in room is: ${users - 1}`)

      socket.leave(room, () => {
        socket.emit('leaved', room, socket.id)

        // 發送給當前房間的所有人, 除了自己以外
        socket.to(room).emit('leaved_user', username)
      })
    }
  })

  socket.on('message', (room, data) => {
    const myRoom = io.sockets.adapter.rooms[room]
    if (myRoom) {
      // socket.emit('message', room, socket.id, data)
      // 發送給當前房間的所有人, 包含自己
      io.in(room).emit('message', room, socket.id, data)
    }
  })
})

httpsServer.listen(443, '0.0.0.0')
