const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

function setRoutes(app) {
    router.post('/users', userController.createUser);
    router.get('/users/:id', userController.getUser);
    router.put('/users/:id', userController.updateUser);

    app.use('/api', router);
}

module.exports = setRoutes;