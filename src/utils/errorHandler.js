function catchAsync(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = catchAsync;
