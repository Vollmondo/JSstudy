module.export = (app) => {
    const auth = require('../controllers/auth.controller')

    // Авторизации
    app.post('/login', authController.login);

    // Регистрация
    app.post('/register', authController.register);
}