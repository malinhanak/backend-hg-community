class HttpError extends Error {
  constructor(message, errorCode, errInfo) {
    super(message);
    this.code = errorCode;
    this.error = errInfo;
  }
}

module.exports = HttpError;
