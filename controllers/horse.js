const { validationResult } = require('express-validator');

const Horse = require('../models/horse');
const { errorHandler } = require('../utils/errorHandler');

async function create(req, res, next) {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) throw new Error('missingOrInvalidInputs');
  } catch (err) {
    return errorHandler(err, next, errors.errors);
  }

  try {
    const createdHorse = new Horse(req.body);

    await createdHorse.save();

    res.status(201).json({ horse: createdHorse });

    return createdHorse;
  } catch (err) {
    return errorHandler(err, next);
  }
}

async function getAll(req, res, next) {
  try {
    const horses = await Horse.find({}, 'name slug _id');

    if (horses.length < 1) throw new Error('noRegisteredHorses');

    res.status(200).json({
      horses: horses.map((horse) => horse.toObject({ getters: true })),
    });

    return horses;
  } catch (err) {
    return errorHandler(err, next);
  }
}

async function getBySlug(req, res, next) {
  const slug = req.params.slug;

  try {
    const horse = await Horse.findOne({ slug: slug });

    if (!horse) throw new Error('horseNotFound');

    res.status(200).json({ horse });

    return horse;
  } catch (err) {
    return errorHandler(err, next);
  }
}

exports.create = create;
exports.getAll = getAll;
exports.getBySlug = getBySlug;
