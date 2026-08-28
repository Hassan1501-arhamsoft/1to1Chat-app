import {registerUserService,loginUserService ,verifyOtpService } from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import User from "../models/user.model.js";
export const registerUser = async (req, res) => {
  
  try {
    const { name, email, password } = req.body;


    const result = await registerUserService({ //! this await is necessary to ensure we register the user before returning the response.
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

    const result = await loginUserService(email, password); //! this await is necessary to ensure we login the user before returning the response.

    return successResponse(
      res,
      "Login successful.",
      result
    );
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};


// controllers/auth.controller.js
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtpService(email, otp);
    return successResponse(res, "Login successful.", result);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const toggle2FA = async (req, res) => {
  try {
    const { email, isTwoFactorEnabled } = req.body;
    
    
    
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");
    
    user.isTwoFactorEnabled = isTwoFactorEnabled;
    await user.save();
    
    return successResponse(res, `2FA is now ${isTwoFactorEnabled ? 'ON' : 'OFF'}`);
  } catch (error) {
    // Reveal the exact error in the backend terminal
    console.error("❌ Toggle 2FA Error:", error);
    return errorResponse(res, error.message, 400);
  }
};