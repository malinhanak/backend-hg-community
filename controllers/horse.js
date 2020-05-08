const { validationResult } = require('express-validator');

const Horse = require('../models/horse');
const { errorHandler } = require('../utils/errorHandler');

async function createHorse(req, res, next) {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) throw new Error('missingOrInvalidInputs');
  } catch (err) {
    errorHandler(err, next, errors.errors);
  }

  try {
    const createdHorse = new Horse(req.body);

    await createdHorse.save();

    res.status(201).json({ horse: createdHorse });

    return createdHorse;
  } catch (err) {
    errorHandler(err, next);
  }
}

async function getAllHorses(req, res, next) {
  try {
    const horses = await Horse.find({}, 'name slug _id');

    if (horses.length < 1) throw new Error('noRegisteredHorses');

    res.status(200).json({
      horses: horses.map((horse) => horse.toObject({ getters: true })),
    });

    return horses;
  } catch (err) {
    errorHandler(err, next);
  }
}

async function getHorseBySlug(req, res, next) {
  const slug = req.params.slug;

  try {
    const horse = await Horse.findOne({ slug: slug });

    if (!horse) throw new Error('horseNotFound');

    res.status(200).json({ horse });

    return horse;
  } catch (err) {
    errorHandler(err, next);
  }
}

exports.createHorse = createHorse;
exports.getAllHorses = getAllHorses;
exports.getHorseBySlug = getHorseBySlug;
