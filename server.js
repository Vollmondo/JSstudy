/* const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const path = require('path')
const User = require ('./app/models/user.model')

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

const dbConfig = require('./config/database.config')
const mongoose = require('mongoose')
const { error } = require('console')

mongoose.Promise = global.Promise

/mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
 */

const express = require("express");
const cors = require("cors");
const dbConfig = require('./app/config/db.config');
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Успешное подключение к базе данных.");
    initial();
  })
  .catch(err => {
    console.error("Ошибка подключения к базе данных", err);
    process.exit();
  });

app.get("/", (req, res) => {
  res.json({ message: "Приложение запущено." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}.`);
});

async function initial() {
    try {
      const count = await Role.estimatedDocumentCount();
      if (count === 0) {
        await Promise.all([
          new Role({ name: "user" }).save(),
          new Role({ name: "moderator" }).save(),
          new Role({ name: "admin" }).save()
        ]);
        console.log("Роли успешно добавлены.");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }