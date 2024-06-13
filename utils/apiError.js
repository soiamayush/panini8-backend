class ApiError extends Error {
  constructor(message = 'Something went wrong', statusCode, errors = []) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errors = errors;
    this.data = null;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
