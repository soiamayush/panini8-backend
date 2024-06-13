const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode);
  res.json({
    status: err.status,
    message: err.message,
    error: err.errors,
    data: null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
  next();
};

export { ErrorHandler };
