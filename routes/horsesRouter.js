const express = require('express');
const horseControllers = require('../controllers/horse-controller');

const horsesRouter = express.Router();

horsesRouter.route('/').get(horseControllers.getAll);

module.exports = horsesRouter;
