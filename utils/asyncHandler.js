const AsyncHandler = (fu) => {
  return (req, res, next) => {
    return Promise.resolve(fu(req, res, next)).catch((error) => next(error));
  };
};

export { AsyncHandler };
