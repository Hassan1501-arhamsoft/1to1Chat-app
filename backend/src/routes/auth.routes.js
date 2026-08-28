import express from "express";
import {registerUser,loginUser ,verifyOtp ,toggle2FA} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.put("/toggle-2fa", toggle2FA);
export default router;