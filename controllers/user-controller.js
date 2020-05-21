const { validationResult } = require('express-validator');

const { asyncWrapper } = require('../utils/asyncWrapper');
const MissingOrInvalidInputError = require('../models/errors/MissingOrInvalidInputError');
const HttpError = require('../models/errors/HttpError');
const ConflictError = require('../models/errors/ConflictError');
const User = require('../models/user');

async function create(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return next(new MissingOrInvalidInputError(`Invalid inputs`, errors.errors));

  const isUserExisting = await User.findOne({ email: req.body.email });
  if (isUserExisting)
    return next(new ConflictError('Den här användaren finns redan, vänligen logga in istället.'));

  const createdUser = new User({ ...req.body, image: '', horses: [] });

  await createdUser.save();

  res.status(201);
  return res.json({ message: 'Användaren är nu skapad, och det går att logga in.' });
}

exports.create = create;
