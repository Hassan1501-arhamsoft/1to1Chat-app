import express from "express";
import { 
  registerUser, 
  loginUser, 
  verifyOtp, 
  generate2FA, 
  verify2FASetup, 
  disable2FA 
} from "../controllers/auth.controller.js";

const router = express.Router();

// Core Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);

// 2FA Management
router.post("/2fa/generate", generate2FA);
router.post("/2fa/verify-setup", verify2FASetup);
router.put("/2fa/disable", disable2FA);

export default router;