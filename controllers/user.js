const { validationResult } = require('express-validator');
const User = require('../models/user');
const { errorHandler } = require('../utils/errorHandler');

async function create(req, res, next) {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) throw new Error('missingOrInvalidInputs');
  } catch (err) {
    return errorHandler(err, next, errors.errors);
  }

  try {
    const isUserExisting = await User.findOne({ email: req.body.email });

    if (isUserExisting) throw new Error('userAlreadyExists');
  } catch (err) {
    return errorHandler(err, next);
  }

  try {
    const createdUser = new User({ ...req.body, image: '', horses: [] });

    await createdUser.save();

    if (!createdUser) throw new Error('couldNotCreateUser');

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });

    return createdUser;
  } catch (err) {
    return errorHandler(err, next);
  }
}

exports.create = create;
