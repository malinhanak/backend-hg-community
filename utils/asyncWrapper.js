const DatabaseError = require('../models/errors/DatabaseError');
function asyncWrapper(callback) {
  return function (req, res, next) {
    return Promise.resolve(callback(req, res, next)).catch((err) => next(new DatabaseError(err.message)));
  };
}

exports.asyncWrapper = asyncWrapper;
