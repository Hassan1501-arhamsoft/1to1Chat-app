import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js"; 

// Helper to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerUserService = async (userData) => {
  const { name, email, password } = userData;
  let user = await User.findOne({ where: { email } });
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  if (user) {
    if (user.isVerified) throw new Error("Email already exists.");
    user.name = name;
    user.password = hashedPassword;
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  } else {
    user = await User.create({
      name, email, password: hashedPassword, otp, otpExpires, isVerified: false
    });
  }

  const emailTemplate = `<h2>Your ChatApp OTP is: ${otp}</h2><p>This code expires in 10 minutes.</p>`;
  await sendEmail(user.email, "Your Verification Code", emailTemplate);

  return { email: user.email, message: "OTP sent to your email." };
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid email or password.");

  // Still enforce that they verified their email when they signed up
  if (!user.isVerified) throw new Error("Please verify your email first.");

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) throw new Error("Invalid email or password.");

  // CHECK: Does the user have 2FA enabled?
  if (user.isTwoFactorEnabled) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const emailTemplate = `<h2>Your Login OTP is: ${otp}</h2><p>This code expires in 10 minutes.</p>`;
    await sendEmail(user.email, "Your Login Code", emailTemplate);

    // Return a flag telling the frontend that 2FA is required
    return { requires2FA: true, email: user.email, message: "OTP sent to your email." };
  } 
  
  // IF 2FA IS OFF: Log them in directly
  const token = generateToken({ userId: user.id });
  return {
    requires2FA: false, // Flag telling frontend to skip OTP
    token,
    user: { id: user.id, name: user.name, email: user.email,isTwoFactorEnabled: user.isTwoFactorEnabled},
  };
};

export const verifyOtpService = async (email, otp) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user || user.otp !== otp) {
    throw new Error("Invalid OTP.");
  }
  if (user.otpExpires < new Date()) {
    throw new Error("OTP has expired. Please log in again to request a new one.");
  }

  // Clear OTP and verify
  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  const token = generateToken({ userId: user.id });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email ,isTwoFactorEnabled: user.isTwoFactorEnabled },
  };
};