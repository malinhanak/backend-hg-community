const express = require('express');
const horseControllers = require('../controllers/horse-controller');

const horseRouter = express.Router();

horseRouter.route('/').get(horseControllers.getAll);

horseRouter.route('/:slug').get(horseControllers.getBySlug);

module.exports = horseRouter;
