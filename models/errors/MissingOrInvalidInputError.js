class MissingOrInvalidInputError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = this.constructor.name;
    this.code = 422;
    this.errors = errors;
  }
}

module.exports = MissingOrInvalidInputError;
