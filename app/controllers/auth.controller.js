const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Поиск пользователя по имени пользователя в базе данных
  User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Проверка пароля
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка при проверке пароля' });
        }

        if (result) {
          // Пароль верный - авторизация успешна
          return res.status(200).json({ message: 'Авторизация успешна' });
        } else {
          // Пароль неверный
          return res.status(401).json({ message: 'Неверный пароль' });
        }
      });
    })
    .catch(error => {
      res.status(500).json({ message: `Ошибка при поиске пользователя: ${error.message}` });
    });
};