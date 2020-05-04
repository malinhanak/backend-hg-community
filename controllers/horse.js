const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error');
const GenericErrorHandler = require('../utils/genericErrorObj');

function horseController(Horse) {
  async function createHorse(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422);
      return res.json(
        GenericErrorHandler(
          'Kontrollera din data, fält saknas eller är felaktiga',
          errors.errors,
        ),
      );
    }

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
    return res.json({horse: createdHorse});
  }

  function collectAndSendHorses(horses, res) {
    res.status(200);
    return res.json({horses: horses.map(horse => horse.toObject({getters: true}))});
  }

  async function getAllHorses(req, res, next) {
    try {
      const horses = await Horse.find({}, 'name slug _id')
      console.log('horses', horses.length)
      collectAndSendHorses(horses, res)
    } catch (err) {
      next(
        new HttpError(
          'Det gick inte att hämta alla hästar, vänligen försök igen',
          500,
        ),
      );
    }
  }

  return {createHorse, getAllHorses};
}

module.exports = horseController;
