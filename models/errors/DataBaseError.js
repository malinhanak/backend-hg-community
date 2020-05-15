class DataBaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 500;
  }
}

module.exports = DataBaseError;
