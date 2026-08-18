import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/response.js";

export const protect = async (req, res, next) => {
    
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(
        res,
        "Not authorized. Token missing.",
        401
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // IMPORTANT: Check your JWT payload
    const user = await User.findById(  //! this await is necessary to ensure we retrieve the user before proceeding with the request.
      decoded.userId || decoded.id
    ).select("-password");

    if (!user) {
      return errorResponse(
        res,
        "User not found.",
        401
      );
    }

    req.user = user;

    next();
  } catch (error) {
    return errorResponse(
      res,
      "Invalid or expired token.",
      401
    );
  }
};