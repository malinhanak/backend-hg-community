const express = require('express');

const createHorseValidator = require('../validators/createHorse');
const horseControllers = require('../controllers/horse');

const horseRouter = express.Router();

horseRouter
  .route('/')
  .post(createHorseValidator, horseControllers.createHorse)
  .get(horseControllers.getAllHorses);

horseRouter.route('/:slug').get(horseControllers.getHorseBySlug);

module.exports = horseRouter;
