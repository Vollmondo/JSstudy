const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const path = require('path')

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

const dbConfig = require('./config/database.config')
const mongoose = require('mongoose')
const { error } = require('console')

mongoose.Promise = global.Promise

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() =>{
    console.log('Успешное подключение к базе данных')
}).catch((error) => {
    console.log('Нет соединения с базой данных', error)
    process.exit()
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/public/html/auth.html`)
})

app.get('/main/', (request, response) => {
    response.sendFile(`${__dirname}/public/main.html`)
})

const PORT = 8000

app.listen(PORT, () =>{
    console.log(`запуск на порте ${PORT}`)
})