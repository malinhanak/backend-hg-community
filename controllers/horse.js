const { validationResult } = require('express-validator');
const GenericErrorHandler = require('../utils/genericErrorObj');
const HttpError = require('../models/http-error');
const Horse = require('../models/horse');

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
  res.json({ horse: createdHorse });
  return createdHorse;
}

function collectAndSendHorses(horses, res) {
  res.status(200);
  return res.json({
    horses: horses.map((horse) => horse.toObject({ getters: true })),
  });
}

async function getAllHorses(req, res, next) {
  try {
    const horses = await Horse.find({}, 'name slug _id');
    collectAndSendHorses(horses, res);
    return horses; // <--- Seems like I need to return like this to make the tests work, saw the same pattern in a course.
  } catch (err) {
    next(
      new HttpError(
        'Det gick inte att hämta alla hästar, vänligen försök igen',
        500,
      ),
    );
  }
}

async function getHorseBySlug(req, res, next) {
  const slug = req.params.slug;

  try {
    const horse = await Horse.findOne({ slug: slug });

    if (!horse) {
      res.status(404);
      const error = new HttpError('Vi kunde inte hitta hästen du söker', 404);
      return next(error);
    }

    res.status(200);
    res.json({ horse: horse.toObject({ getters: true }) });
    return horse;
  } catch (err) {
    next(
      new HttpError(
        'Det gick inte att hämta hästen, vänligen försök igen',
        500,
      ),
    );
  }
}

exports.createHorse = createHorse;
exports.getAllHorses = getAllHorses;
exports.getHorseBySlug = getHorseBySlug;
