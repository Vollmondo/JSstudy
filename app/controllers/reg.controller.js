const bcrypt = require('bcrypt');

exports.register = (req, res) => {
  const { username, password } = req.body;

  // Хеширование пароля
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при хешировании пароля' });
    }

    const user = new User({
      username,
      password: hash
    });

    user.save()
      .then(() => {
        res.status(200).json({ message: 'Пользователь успешно зарегистрирован' });
      })
      .catch(error => {
        res.status(500).json({ message: `Ошибка при регистрации пользователя: ${error.message}` });
      });
  });
};