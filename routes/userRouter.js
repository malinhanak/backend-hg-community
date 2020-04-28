const express = require('express');

const createUserValidator = require('../validators/createUser');
const userControllers = require('../controllers/user');

function routes(User) {
  const userRouter = express.Router();
  const controllers = userControllers(User);

  userRouter.route('/signup').post(controllers.createUser);

  return userRouter;
}

module.exports = routes;
