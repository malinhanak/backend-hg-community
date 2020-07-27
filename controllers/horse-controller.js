const { validationResult } = require('express-validator');

const HorseNotFoundError = require('../models/errors/HorseNotFoundError');
const MissingOrInvalidInputError = require('../models/errors/MissingOrInvalidInputError');
const HttpError = require('../models/errors/HttpError');
const Horse = require('../models/horse');
const { asyncWrapper } = require('../utils/asyncWrapper');
const { createSlug } = require('../utils/createSlug');

async function getAll(req, res, next) {
  const horses = await Horse.find({}, 'name slug _id');

  if (!horses.length) {
    return next(new HorseNotFoundError(`There are no horses registered or they have escaped`));
  }

  res.status(200);
  return res.json({
    horses: horses.map((horse) => horse.toObject({ getters: true })),
  });
}

async function getBySlug(req, res, next) {
  const slug = req.params.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new HorseNotFoundError(`Could not find horse with slug ${slug}`));
  }

  res.status(200);
  return res.json({ horse });
}
async function create(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new MissingOrInvalidInputError(`Invalid inputs`, errors.errors));
  }

  const createdHorse = new Horse({ ...req.body, slug: createSlug(req.body.name) });

  await createdHorse.save();

  res.status(201);
  return res.json({ message: `${createdHorse.name} skapades utan problem` });
}

async function update(req, res, next) {
  const slug = req.params.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new HorseNotFoundError(`Could not find horse with slug ${slug}`));
  }

  const newHorseData = req.body;
  const responseMsg = newHorseData.name
    ? `${newHorseData.name} [Prev. ${horse.name} ] har nu blivit uppdaterad`
    : `${horse.name} har nu blivit uppdaterad`;

  if (newHorseData.slug) return next(new HttpError('Redigering av slug är inte tillåtet', 500));
  if (newHorseData.name) newHorseData.slug = createSlug(newHorseData.name);

  await Horse.updateOne({ slug: slug }, newHorseData);

  res.status(200).json({ message: responseMsg });
}

async function remove(req, res, next) {
  const slug = req.params.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new HorseNotFoundError(`Could not find horse with slug ${slug}`));
  }

  await Horse.deleteOne({ slug: slug });

  res.status(200).json({ message: `${horse.name} är nu raderad.` });
}

exports.create = asyncWrapper(create);
exports.update = asyncWrapper(update);
exports.remove = asyncWrapper(remove);
exports.getAll = asyncWrapper(getAll);
exports.getBySlug = asyncWrapper(getBySlug);
