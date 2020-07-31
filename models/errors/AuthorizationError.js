class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.code = 403;
  }
}

module.exports = AuthorizationError;
