class DatabaseError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = this.constructor.name;
    this.code = 500;
    this.errors = errors;
  }
}

module.exports = DatabaseError;
