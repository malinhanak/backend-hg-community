const { validationResult } = require('express-validator');

const EntityNotFoundError = require('../models/errors/EntityNotFoundError');
const AuthorizationError = require('../models/errors/AuthorizationError');
const MissingOrInvalidInputError = require('../models/errors/MissingOrInvalidInputError');
const HttpError = require('../models/errors/HttpError');
const Horse = require('../models/horse');
const { asyncWrapper } = require('../utils/asyncWrapper');
const { createSlug } = require('../utils/createSlug');

async function getAll(req, res, next) {
  const horses = await Horse.find({}, 'name slug ownership skills');

  if (!horses.length) {
    return next(new EntityNotFoundError(`Hittar inga hästar, eller så har alla rymt`));
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
    return next(new EntityNotFoundError(`Hittar inte hästen med slug ${slug}`));
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
    return next(new EntityNotFoundError(`Could not find horse with slug ${slug}`));
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

async function updateBreedingStatus(req, res, next) {
  const slug = req.body.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new EntityNotFoundError(`Could not find horse with slug ${slug}`));
  }

  const status = horse.breeding.status ? false : true;

  await Horse.updateOne({ slug: slug }, { 'breeding.status': status });

  res
    .status(200)
    .json({ message: `${horse.name} är nu ${status ? 'aktiv' : 'inaktiv'} inom avel.` });
}

async function updateSaleStatus(req, res, next) {
  const slug = req.body.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new EntityNotFoundError(`Could not find horse with slug ${slug}`));
  }

  const status = horse.forSale ? false : true;

  await Horse.updateOne({ slug: slug }, { forSale: status });

  res.status(200).json({ message: `${horse.name} är ${status ? 'nu' : 'inte längre'} till salu` });
}

async function retire(req, res, next) {
  const slug = req.body.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new EntityNotFoundError(`Could not find horse with slug ${slug}`));
  }

  await Horse.updateOne({ slug: slug }, { active: false });

  res.status(200).json({ message: `${horse.name} är nu pensionerad.` });
}

async function updateLevel(req, res, next) {
  const slug = req.params.slug;
  const discipline = req.body.discipline;
  const maxLevel = req.body.maxLevel;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new EntityNotFoundError(`Could not find horse with slug ${slug}`));
  }

  const newLevel = req.body.level + 1;
  const response = { ...horse.skills, [discipline]: [newLevel, maxLevel] };

  await Horse.updateOne({ slug: slug }, { skills: response });

  res.status(200).json({ message: `${horse.name} level är nu uppdaterad` });
}

async function transfer(req, res, next) {
  const slug = req.params.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new EntityNotFoundError(`Could not find horse with slug ${slug}`));
  }

  const newOwner = req.body.id;

  await Horse.updateOne({ slug: slug }, { 'ownership.owner': newOwner });

  res.status(200).json({ message: `${horse.name} har nu blivit flyttad till ${newOwner.name}` });
}

async function remove(req, res, next) {
  const slug = req.params.slug;
  const horse = await Horse.findOne({ slug: slug });

  if (!horse) {
    return next(new EntityNotFoundError(`Could not find horse with slug ${slug}`));
  }

  await Horse.deleteOne({ slug: slug });

  res.status(200).json({ message: `${horse.name} är nu raderad.` });
}

async function removeAll(req, res, next) {
  if (!req.user || (req.user && !req.user.roles.includes('ADMIN'))) {
    return next(new AuthorizationError('Du saknar behörighet'));
  }

  await Horse.deleteMany({});

  res.status(200).json({ message: `Alla hästar är nu raderade!` });
}

exports.create = asyncWrapper(create);
exports.getAll = asyncWrapper(getAll);
exports.getBySlug = asyncWrapper(getBySlug);
exports.update = asyncWrapper(update);
exports.remove = asyncWrapper(remove);
exports.removeAll = asyncWrapper(removeAll);
exports.retire = asyncWrapper(retire);
exports.updateBreedingStatus = asyncWrapper(updateBreedingStatus);
exports.updateSaleStatus = asyncWrapper(updateSaleStatus);
exports.transfer = asyncWrapper(transfer);
exports.updateLevel = asyncWrapper(updateLevel);
