const express = require('express');

const createHorseValidator = require('../validators/createHorse');
const horseControllers = require('../controllers/horse-controller');
const cmsControllers = require('../controllers/cms-controller');

const cmsRouter = express.Router();

cmsRouter
  .route('/horses/')
  .post(createHorseValidator, cmsControllers.create)
  .get(horseControllers.getAll);

cmsRouter
  .route('/horse/:slug')
  .get(horseControllers.getBySlug)
  .patch(cmsControllers.update)
  .delete(cmsControllers.remove);

module.exports = cmsRouter;
