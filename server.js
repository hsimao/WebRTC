const http = require('http')
const https = require('https')
const fs = require('fs')
const express = require('express')
const serveIndex =require('serve-index')

const app = express()

app.use(serveIndex('./public'))
app.use(express.static('./public'))

const httpServer = http.createServer(app)
httpServer.listen(80, '0.0.0.0')

const options = {
  key: fs.readFileSync('./cert/localhost-key.pem'),
  cert: fs.readFileSync('./cert/localhost.pem')
}
const httpsServer = https.createServer(options, app)
httpsServer.listen(443, '0.0.0.0')