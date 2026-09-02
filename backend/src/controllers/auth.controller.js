import { 
  registerUserService, 
  loginUserService, 
  verifyOtpService,
  generate2FAService,
  verify2FASetupService,
  disable2FAService,
  forgotPasswordService,
  resetPasswordService,
  // googleAuthService
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

export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    return successResponse(res, result.message, null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordService(email, otp, newPassword);
    return successResponse(res, result.message, null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};



// export const googleAuth = async (req, res) => {
//   try {
//     const { token } = req.body;
//     const result = await googleAuthService(token);
//     return successResponse(res, "Google login successful.", result, 200);
//   } catch (error) {
//     return errorResponse(res, error.message, 400);
//   }
// };