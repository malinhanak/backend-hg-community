const { validationResult } = require('express-validator');

const { asyncWrapper } = require('../utils/asyncWrapper');
const HorseNotFoundError = require('../models/errors/HorseNotFoundError');
const MissingOrInvalidInputError = require('../models/errors/MissingOrInvalidInputError');
const Horse = require('../models/horse');
const { createSlug } = require('../utils/createSlug');

async function create(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new MissingOrInvalidInputError(`Invalid inputs`, errors.errors));
  }

  const createdHorse = new Horse({ ...req.body, slug: createSlug(req.body.name) });

  await createdHorse.save();

  res.status(201);
  return res.json({ message: `${createdHorse.name} skapades utan problem` });

  // return { message: `${createdHorse.name} skapades utan problem` };
}

async function getAll(req, res, next) {
  const horses = await Horse.find({}, 'name slug _id');

  if (!horses.length) {
    return next(new HorseNotFoundError(`There are no horses registered or they have escaped`));
  }

  res.status(200).json({
    horses: horses.map((horse) => horse.toObject({ getters: true })),
  });

  return horses;
}

async function getBySlug(req, res, next) {
  const slug = req.params.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new HorseNotFoundError(`Could not find horse with slug ${slug}`));
  }

  res.status(200).json({ horse });

  return horse;
}

exports.create = asyncWrapper(create);
exports.getAll = asyncWrapper(getAll);
exports.getBySlug = asyncWrapper(getBySlug);
