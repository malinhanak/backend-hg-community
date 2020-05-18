const { validationResult } = require('express-validator');
const User = require('../models/user');

async function create(req, res, next) {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) throw new Error('missingOrInvalidInputs');
  } catch (err) {
    return next(err);
  }

  try {
    const isUserExisting = await User.findOne({ email: req.body.email });

    if (isUserExisting) throw new Error('userAlreadyExists');
  } catch (err) {
    return next(err);
  }

  try {
    const createdUser = new User({ ...req.body, image: '', horses: [] });

    await createdUser.save();

    if (!createdUser) throw new Error('couldNotCreateUser');

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });

    return createdUser;
  } catch (err) {
    return next(err);
  }
}

exports.create = create;
