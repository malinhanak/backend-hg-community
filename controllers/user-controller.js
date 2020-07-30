const { validationResult } = require('express-validator');

const { asyncWrapper } = require('../utils/asyncWrapper');
const MissingOrInvalidInputError = require('../models/errors/MissingOrInvalidInputError');
const HttpError = require('../models/errors/HttpError');
const EntityNotFoundError = require('../models/errors/EntityNotFoundError');
const ConflictError = require('../models/errors/ConflictError');
const User = require('../models/user');

async function create(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new MissingOrInvalidInputError(`Invalid inputs`, errors.errors));
  }

  const isUserExisting = await User.findOne({ email: req.body.email });

  if (isUserExisting) {
    return next(new ConflictError('Den här användaren finns redan, vänligen logga in istället.'));
  }

  const createdUser = new User({ ...req.body, image: '', horses: [] });

  await createdUser.save();

  res.status(201);
  return res.json({ message: 'Användaren är nu skapad!' });
}

async function getAll(req, res, next) {
  const users = await User.find({});

  if (!users.length) {
    return next(new EntityNotFoundError(`Det finns inga registrerade medlemmar`));
  }

  res.status(200);
  return res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
}

async function login(req, res, next) {
  const user = await User.findOne({ email: 'tester@test.se' });

  if (!user) {
    return next(new EntityNotFoundError(`Det gick inte att hitta användaren`));
  }

  req.session.isOnline = true;
  req.session.user = user;
  res.status(200).json({ message: 'Du loggades in' });
}

async function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(new HttpError('Något gick fel!', 500));

    res.status(200).json({ message: 'Du blev utloggad' });
  });
}

// async function terminateMembership(req, res, next) {
//   const users = await User.findOne({});

//   if (!users.length) {
//     return next(new EntityNotFoundError(`Det finns inga registrerade medlemmar`));
//   }

//   res.status(200);
//   return res.json({
//     users: users.map((user) => user.toObject({ getters: true })),
//   });
// }

exports.create = asyncWrapper(create);
exports.login = asyncWrapper(login);
exports.logout = asyncWrapper(logout);
exports.getAll = asyncWrapper(getAll);
