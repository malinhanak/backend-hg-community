function asyncWrapper(callback) {
  return function (req, res, next) {
    return Promise.resolve(callback(req, res, next)).catch(next);
  };
}

exports.asyncWrapper = asyncWrapper;
