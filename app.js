const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const options = {
    target: 'http://drawit.click',
    changeOrigin: true,
    router: {
        'jackpot.drawit.click': 'http://localhost:8001',
        'todo.drawit.click': 'http://localhost:8002',
        'translator.drawit.click': 'http://localhost:8003',
    }
}

const app = express();
const port = 80

app.use('/', createProxyMiddleware(options))

app.listen(port, () => {
    console.log('listening on: ' + port)
})