import { 
  registerUserService, 
  loginUserService, 
  verifyOtpService,
  generate2FAService,
  verify2FASetupService,
  disable2FAService 
} from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password , recaptchaToken } = req.body;
    const result = await registerUserService({ name, email, password ,recaptchaToken });
    return successResponse(res, "User registered successfully.", result, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService(email, password); 
    return successResponse(res, "Login successful.", result);
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtpService(email, otp);
    return successResponse(res, "Verification successful.", result);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// --- NEW: 2FA Management Controllers ---

export const generate2FA = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await generate2FAService(email);
    return successResponse(res, "QR Code generated.", result);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const verify2FASetup = async (req, res) => {
  try {
    const { email, token, secret } = req.body;
    const result = await verify2FASetupService(email, token, secret);
    return successResponse(res, "2FA enabled.", result);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const disable2FA = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await disable2FAService(email);
    return successResponse(res, "2FA disabled.", result);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};