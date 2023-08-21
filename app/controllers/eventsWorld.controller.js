const EventsWorld = require('../models/eventsWorld.model');

// Создание события
exports.create = (req, res) => {
  // Валидация данных
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      message: 'Наименование и описание события должны быть заполнены',
      success: false
    });
  }

  const event = new EventsWorld({
    name: req.body.name,
    description: req.body.description
  });

  event.save()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).json({
        message: `Ошибка при создании события: ${error.message}`,
        success: false
      });
    });
};

// Получение всех событий
exports.findAll = (req, res) => {
  EventsWorld.find()
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).json({
        message: `Ошибка при получении событий: ${error.message}`,
        success: false
      });
    });
};

// Получение определенного события по его ID
exports.findOne = (req, res) => {
  const eventId = req.params.id;

  EventsWorld.findById(eventId)
    .then(data => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({
          message: 'Событие не найдено',
          success: false
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `Ошибка при получении события: ${error.message}`,
        success: false
      });
    });
};

// Обновление информации о событии
exports.update = (req, res) => {
  const eventId = req.params.id;

  // Валидация данных
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      message: 'Наименование и описание события должны быть заполнены',
      success: false
    });
  }

  EventsWorld.findByIdAndUpdate(eventId, {
    name: req.body.name,
    description: req.body.description
  }, { new: true })
    .then(data => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({
          message: 'Событие не найдено',
          success: false
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `Ошибка при обновлении события: ${error.message}`,
        success: false
      });
    });
};

// Удаление события
exports.delete = (req, res) => {
  const eventId = req.params.id;

  EventsWorld.findByIdAndDelete(eventId)
    .then(data => {
      if (data) {
        res.json({
          message: 'Событие успешно удалено',
          success: true
        });
      } else {
        res.status(404).json({
          message: 'Событие не найдено',
          success: false
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `Ошибка при удалении события: ${error.message}`,
        success: false
      });
    });
};