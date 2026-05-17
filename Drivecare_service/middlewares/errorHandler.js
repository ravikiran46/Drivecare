const mongoose = require("mongoose");

const errorhandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  let code = "ERR_INTERNAL_SERVER";
  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    code = "VALIDATION_ERROR";
    const errors = Object.values(err.errors).map((e) => e.message);
    message = `Validation Error: ${errors.join(", ")}`;
  }

  //   Handle Mongoose cast errors (e.g., invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    status = 400;
    code = "CAST_ERROR";
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    status = 400;
    code = "DUPLICATE_KEY_ERROR";
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field}: ${err.keyValue[field]}`;
  }
  // send response

  res.status(status).json({
    success: false,
    message,
    // code,
    // Optionally include stack trace in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorhandler;
