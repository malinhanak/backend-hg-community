const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

const HorseNotFoundError = require('../models/errors/HorseNotFoundError');
const MissingOrInvalidInputError = require('../models/errors/MissingOrInvalidInputError');
const Horse = require('../models/horse');

async function create(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new MissingOrInvalidInputError(`Invalid inputs`));
  }

  try {
    const createdHorse = new Horse(req.body);

    await createdHorse.save();

    res.status(201).json({ horse: createdHorse });

    return createdHorse;
  } catch (err) {
    return next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const horses = await Horse.find({}, 'name slug _id');

    if (!horses.length) {
      return next(new HorseNotFoundError(`There are no horses registered or they have escaped`));
    }

    res.status(200).json({
      horses: horses.map((horse) => horse.toObject({ getters: true })),
    });

    return horses;
  } catch (err) {
    return next(err);
  }
}

async function getBySlug(req, res, next) {
  const slug = req.params.slug;

  try {
    const horse = await Horse.findOne({ slug: slug });

    if (!horse) {
      return next(new HorseNotFoundError(`Could not find horse with slug ${slug}`));
    }

    res.status(200).json({ horse });

    return horse;
  } catch (err) {
    return next(err);
  }
}

exports.create = create;
exports.getAll = getAll;
exports.getBySlug = getBySlug;
