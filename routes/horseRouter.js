const express = require('express');
const createHorseValidator = require('../validators/createHorse');
const horseControllers = require('../controllers/horse-controller');

const horseRouter = express.Router();

horseRouter
  .route('/')
  .post(createHorseValidator, horseControllers.create)
  .get(horseControllers.getAll);

horseRouter.route('/breeding/status').patch(horseControllers.updateBreedingStatus);

horseRouter.route('/transfer/:slug').patch(horseControllers.transfer);

horseRouter.route('/retire').patch(horseControllers.retire);

horseRouter
  .route('/horse/:slug')
  .get(horseControllers.getBySlug)
  .patch(horseControllers.update)
  .delete(horseControllers.remove);

module.exports = horseRouter;
