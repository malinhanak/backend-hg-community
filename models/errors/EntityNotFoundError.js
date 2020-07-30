class EntityNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 404;
  }
}

module.exports = EntityNotFoundError;
