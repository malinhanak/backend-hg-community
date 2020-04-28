const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

function horseController(Horse) {
  async function createHorse(req, res, next) {
    const createdHorse = new Horse(req.body);

    try {
      await createdHorse.save();
    } catch (err) {
      return next(
        new HttpError(
          'Det gick inte att skapa hästen, vänligen försök igen',
          500,
        ),
      );
    }
    res.status(201);
    res.json({ horse: createdHorse });
  }

  return { createHorse };
}

module.exports = horseController;
