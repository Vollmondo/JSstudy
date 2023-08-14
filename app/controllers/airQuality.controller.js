const airQuality = require('../models/airQuality.models')
const axios = require('axios');
const odinEsServer = 'http://10.2.10.91/api/data'

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

    const airQualityObj = new airQuality({
        name: req.body.name,
        description: req.body.description
    })
    airQualityObj.save()
        .then(data => {
            // Отправить данные пост запросом на удаленный сервер
            axios.post(odinEsServer, data)
                .then(response => {
                    res.send(response.data);
                })
                .catch(error => {
                    res.status(500).send({
                        message: `Ошибка при отправке данных на удаленный сервер: ${error.message}`,
                        success: false
                    });
                });
        })
        .catch(error => {
            res.status(500).send({
                message: `Данные не записались: ${error.message}`,
                success: false
            });
        })
    }
