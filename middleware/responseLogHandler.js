const responseLogHandler = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    res.locals.responseData = data; // Store response
    return originalJson.call(this, data);
  };
  next();
};

export default responseLogHandler;
