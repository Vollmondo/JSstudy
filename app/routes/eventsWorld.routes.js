module.export = (app) => {
    const eventsWorld = require('../controllers/eventsWorld.controller')

    //создание события
    app.post('/event', eventsWorld.create)

    //получить все события
    app.get('/events', eventsWorld.findAll)

    //получить определенное событие
    app.get('/event/:id', eventsWorld.findOne)

    //обновить информацию о событии
    app.put('/event/:id', eventsWorld.update)

    //удалить событие
    app.delete('/event/:id', eventsWorld.delete)

}