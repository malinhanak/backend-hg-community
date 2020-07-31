const express = require('express');
const createHorseValidator = require('../validators/createHorse');
const horseController = require('../controllers/horse-controller');

const horseRouter = express.Router();

horseRouter.route('/').post(createHorseValidator, horseController.create);

horseRouter.route('/breeding/status').patch(horseController.updateBreedingStatus);

horseRouter.route('/sale/status').patch(horseController.updateSaleStatus);

horseRouter.route('/transfer/:slug').patch(horseController.transfer);

horseRouter.route('/update-level/:slug').patch(horseController.updateLevel);

horseRouter.route('/retire').patch(horseController.retire);

horseRouter
  .route('/:slug')
  .get(horseController.getBySlug)
  .patch(horseController.update)
  .delete(horseController.remove);

module.exports = horseRouter;
