const express = require('express');

const createUserValidator = require('../validators/createUser');
const userControllers = require('../controllers/user');

const userRouter = express.Router();

userRouter.route('/signup').post(createUserValidator, userControllers.create);

module.exports = userRouter;
