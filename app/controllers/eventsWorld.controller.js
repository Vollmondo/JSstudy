const EventsWorld = require('../models/eventsWorld.model')

//создание события
exports.create = (req, res) => {
    //валидация данных
    if (!req.body.name){
        return res.status(400).send({
            message: 'Наименование события не может быть пустым',
            success: false
        })
    }

    if (!req.body.description){
        return res.status(400).send({
            message: 'Наименование события не может быть пустым',
            success: false
        })
    }

    const eventWorld = new EventsWorld({
        name: req.body.name,
        description: req.body.description
    })

    eventWorld.save()
    .then(data => {
        res.send(data)
    }).catch((error) =>{
        res.status(500).send({
            message: `Данные не записались: ${error.message}`,
            success: false
        })
    })
}

//получение всех событий
exports.findAll = (req, res) => {}

//получить определенное событие
exports.findOne = (req, res) => {}

//обновить информацию о событии
exports.update = (req, res) => {}

//удалить событие
exports.delete = (req, res) => {}
