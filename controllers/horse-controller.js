const { asyncWrapper } = require('../utils/asyncWrapper');
const HorseNotFoundError = require('../models/errors/HorseNotFoundError');
const Horse = require('../models/horse');

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

exports.getAll = asyncWrapper(getAll);
exports.getBySlug = asyncWrapper(getBySlug);
