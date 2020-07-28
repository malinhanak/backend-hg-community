const express = require('express');
const createHorseValidator = require('../validators/createHorse');
const horseControllers = require('../controllers/horse-controller');

const horseRouter = express.Router();

horseRouter.route('/').post(createHorseValidator, horseControllers.create);

horseRouter.route('/breeding/status').patch(horseControllers.updateBreedingStatus);

horseRouter.route('/sale/status').patch(horseControllers.updateSaleStatus);

horseRouter.route('/transfer/:slug').patch(horseControllers.transfer);

horseRouter.route('/retire').patch(horseControllers.retire);

horseRouter
  .route('/:slug')
  .get(horseControllers.getBySlug)
  .patch(horseControllers.update)
  .delete(horseControllers.remove);

module.exports = horseRouter;
