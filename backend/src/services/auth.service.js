import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


// --- 1. REGISTRATION & LOGIN ---

export const registerUserService = async (userData) => {
  const { name, email, password, recaptchaToken } = userData;

  if (!recaptchaToken) throw new Error("reCAPTCHA token is missing.");

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
  
  const recaptchaRes = await fetch(verifyUrl, { method: "POST" });
  const recaptchaData = await recaptchaRes.json();
  
  if (!recaptchaData.success) {
    throw new Error("reCAPTCHA verification failed. Are you a bot?");
  }

  let user = await User.findOne({ where: { email } });
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

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
  if (!user.isVerified) throw new Error("Please verify your email first.");

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) throw new Error("Invalid email or password.");

  // If 2FA is enabled, prompt for Authenticator app (No email sent!)
  if (user.isTwoFactorEnabled) {
    return { requires2FA: true, email: user.email, message: "Please enter your Authenticator code." };
  } 
  
  const token = generateToken({ userId: user.id });
  return {
    requires2FA: false,
    token,
    user: { id: user.id, name: user.name, email: user.email, isTwoFactorEnabled: user.isTwoFactorEnabled },
  };
};

// Handles BOTH Signup Email OTP and Login Authenticator OTP
export const verifyOtpService = async (email, otp) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found.");

  if (!user.isVerified) {
    // A. Signup Flow: Verify Email OTP
    if (user.otp !== otp) throw new Error("Invalid OTP.");
    if (user.otpExpires < new Date()) throw new Error("OTP has expired.");
    
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
  } else if (user.isTwoFactorEnabled) {
    // B. Login Flow: Verify Authenticator TOTP
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: otp,
      window: 1 // allows 30 seconds of drift
    });
    if (!isValid) throw new Error("Invalid authenticator code.");
  } else {
    throw new Error("Invalid request.");
  }

  const token = generateToken({ userId: user.id });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, isTwoFactorEnabled: user.isTwoFactorEnabled },
  };
};

// --- 2. AUTHENTICATOR SETUP & MANAGEMENT ---

export const generate2FAService = async (email) => {
  const secret = speakeasy.generateSecret({ name: `ChatApp (${email})` });
  
  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
  
  return { secret: secret.base32, qrCodeUrl };
};

export const verify2FASetupService = async (email, token, secret) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const isValid = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1
  });

  if (!isValid) throw new Error("Invalid authenticator code.");

  user.twoFactorSecret = secret;
  user.isTwoFactorEnabled = true;
  await user.save();

  return { message: "Authenticator successfully enabled!" };
};

export const disable2FAService = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  user.isTwoFactorEnabled = false;
  user.twoFactorSecret = null;
  await user.save();

  return { message: "Authenticator disabled." };
};