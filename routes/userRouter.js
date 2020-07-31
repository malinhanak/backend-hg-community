const express = require('express');

const createUserValidator = require('../validators/createUser');
const userController = require('../controllers/user-controller');

const userRouter = express.Router();

userRouter.route('/').get(userController.getAll).delete(userController.removeAll);

userRouter.route('/signup').post(createUserValidator, userController.create);
userRouter.route('/login').post(userController.login);
userRouter.route('/logout').post(userController.logout);

userRouter.route('/horses/owned').get(userController.usersHorses);
userRouter.route('/horses/transfer').post(userController.terminateMembership);

module.exports = userRouter;
