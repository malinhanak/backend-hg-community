const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const { asyncWrapper } = require('../utils/asyncWrapper');
const { findHorses } = require('../utils/findHorses');
const MissingOrInvalidInputError = require('../models/errors/MissingOrInvalidInputError');
const HttpError = require('../models/errors/HttpError');
const EntityNotFoundError = require('../models/errors/EntityNotFoundError');
const ConflictError = require('../models/errors/ConflictError');
const User = require('../models/user');
const Horse = require('../models/horse');

async function create(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new MissingOrInvalidInputError(`Invalid inputs`, errors.errors));
  }

  const isUserExisting = await User.findOne({ email: req.body.email });

  if (isUserExisting) {
    return next(new ConflictError('Den här användaren finns redan, vänligen logga in istället.'));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const createdUser = new User({ ...req.body, password: hashedPassword, image: '', horses: [] });
  await createdUser.save();

  res.status(201);
  return res.json({ message: 'Användaren är nu skapad!' });
}

async function getAll(req, res, next) {
  const users = await User.find({}, 'email characterName _id roles');

  if (!users.length) {
    return next(new EntityNotFoundError(`Det finns inga registrerade medlemmar`));
  }

  res.status(200);
  return res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
}

async function login(req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new EntityNotFoundError(`Användarnamn eller lösord är felaktigt`));
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

async function usersHorses(req, res, next) {
  const horses = await findHorses('ownership.owner', req.body.id, 'name');

  if (!horses.length) {
    return next(new EntityNotFoundError(`Äger inga hästar`));
  }

  res.status(200);
  return res.json({
    userId: req.body.id,
    horses: horses,
  });
}

async function terminateMembership(req, res, next) {
  // Authorization is required.
  // if (!req.user || (req.session.user._id !== req.body.id)) {
  //   return next(new AuthorizationError('Du saknar behörighet'));
  // }

  await Horse.updateMany(
    { 'ownership.owner': req.body.id },
    { 'ownership.owner': '5eb3a31545148284fceb984e' },
  );

  await Horse.updateMany({ 'ownership.renter': req.body.id }, { 'ownership.renter': null });

  await Horse.updateMany({ 'ownership.caretaker': req.body.id }, { 'ownership.caretaker': null });

  // Deleting the user
  // await User.findByIdAndDelete(req.body.id)

  res.status(200);
  return res.json({
    message: 'Hästarna flyttade',
  });
}

async function removeAll(req, res, next) {
  if (!req.user || (req.user && !req.user.roles.includes('ADMIN'))) {
    return next(new AuthorizationError('Du saknar behörighet'));
  }

  await User.deleteMany({});

  res.status(200).json({ message: `Alla användare är nu raderade!` });
}

exports.create = asyncWrapper(create);
exports.login = asyncWrapper(login);
exports.logout = asyncWrapper(logout);
exports.getAll = asyncWrapper(getAll);
exports.usersHorses = asyncWrapper(usersHorses);
exports.terminateMembership = asyncWrapper(terminateMembership);
exports.removeAll = asyncWrapper(removeAll);
