class ServerError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    // this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ServerError;
