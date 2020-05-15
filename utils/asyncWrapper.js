const DataBaseError = require('../models/errors/DataBaseError');

function asyncWrapper(callback) {
  return function (req, res, next) {
    return Promise.resolve(callback(req, res, next)).catch((err) => next(new DataBaseError(err.message)));
  };
}

exports.asyncWrapper = asyncWrapper;
