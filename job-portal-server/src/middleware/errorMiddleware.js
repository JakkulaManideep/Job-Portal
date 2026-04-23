const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      details: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate resource" });
  }

  return res.status(statusCode).json({
    message: err.message || "Server error",
  });
};

module.exports = { notFound, errorHandler };