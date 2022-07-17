const express = require('express')
const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')


const app = express();
const port = 80
const httpsPort = 443


// PROXY CONFIG

const options = {
    target: 'https://drawit.click',
    changeOrigin: true,
    router: {
        'jackpot.drawit.click': 'http://localhost:8001',
        'todo.drawit.click': 'http://localhost:8002',
        'translator.drawit.click': 'http://localhost:8003',
    }
}

app.use('/', createProxyMiddleware(options))


// HTTPS CONFIG

const httpsServer = https.createServer({
    key: fs.readFileSync("../../../etc/letsencrypt/archive/drawit.click/privkey1.pem"),
    cert: fs.readFileSync("../../../etc/letsencrypt/archive/drawit.click/fullchain1.pem"),
    ca: fs.readFileSync("../../../etc/letsencrypt/archive/drawit.click/chain1.pem")
}, app)

httpsServer.listen(httpsPort, () => {
    console.log('HTTPS listening on port: ' + httpsPort) 
})


// redirect HTTP server

const httpApp = express()
httpApp.all('*', (req, res) => res.redirect("https://" + req.headers.host + req.url ))
const httpServer = http.createServer(httpApp)
httpServer.listen(port, () => console.log('HTTP listening on port: ' + port))