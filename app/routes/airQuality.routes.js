module.export = (app) => {
    const eventsWorld = require('../controllers/eventsWorld.controller')

    //создание события
    app.post('/event', eventsWorld.create)
}