const loggerMiddleware = (req, res, next) => {
  const currentTime = new Date().toLocaleString();

  console.log("==================================");
  console.log(`Time   : ${currentTime}`);
  console.log(`Method : ${req.method}`);
  console.log(`URL    : ${req.originalUrl}`);
  console.log("==================================");

  next();
};

export default loggerMiddleware;