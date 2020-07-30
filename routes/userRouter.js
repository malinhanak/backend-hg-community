const express = require('express');

const createUserValidator = require('../validators/createUser');
const userControllers = require('../controllers/user-controller');

const userRouter = express.Router();

userRouter.route('/').get(userControllers.getAll);

userRouter.route('/signup').post(createUserValidator, userControllers.create);
userRouter.route('/login').post(userControllers.login);
userRouter.route('/logout').post(userControllers.logout);

module.exports = userRouter;
