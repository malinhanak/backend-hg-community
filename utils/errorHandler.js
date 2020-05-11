const HttpError = require('../models/http-error');

const error = {};

const errorHandler = (err, next, details = null) => {
  if (err.message === 'horseNotFound') {
    const error = new HttpError(err.message, 404, null);
    return next(error);
  } else if (err.message === 'noRegisteredHorses') {
    const error = new HttpError(err.message, 404, null);
    return next(error);
  } else if (err.message === 'missingOrInvalidInputs') {
    const error = new HttpError(err.message, 422, details);
    return next(error);
  } else if (err.message === 'userAlreadyExists') {
    const error = new HttpError(err.message, 422, null);
    return next(error);
  } else if (err.message === 'couldNotCreateUser') {
    const error = new HttpError(err.message, 500, null);
    return next(error);
  } else {
    const error = new HttpError('unkownError', 500);
    return next(error);
  }
};

exports.errorHandler = errorHandler;
exports.error = error;
