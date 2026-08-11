import { errorResponse } from "../utils/response.js";

const notFoundMiddleware = (req, res, next) => {
  return res.status(404).json(
    errorResponse(
      `Route ${req.originalUrl} not found`,
      404
    )
  );
};

export default notFoundMiddleware;