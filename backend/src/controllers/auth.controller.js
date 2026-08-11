import {registerUserService,loginUserService,} from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const registerUser = async (req, res) => {
  
  try {
    const { name, email, password } = req.body;


    const result = await registerUserService({
      name,
      email,
      password,
    });

    return successResponse(
      res,
      "User registered successfully.",
      result,
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginUserService(email, password);

    return successResponse(
      res,
      "Login successful.",
      result
    );
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};