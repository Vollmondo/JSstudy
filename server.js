const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/public/auth/auth.html`)
})

app.get('/main/', (request, response) => {
    response.sendFile(`${__dirname}/public/main.html`)
})

const PORT = 8000

app.listen(PORT, () =>{
    console.log(`запуск на порте ${PORT}`)
})