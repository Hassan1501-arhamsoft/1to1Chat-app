import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const registerUserService = async (userData) => {
  const { name, email, password } = userData;

  // Check existing user
  const existingUser = await User.findOne({ email }); //! this await is necessary to ensure we check for existing users before proceeding with registration.

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10); //! this await is necessary to ensure we generate a salt before hashing the password.
  const hashedPassword = await bcrypt.hash(password, salt); //! this await is necessary to ensure we hash the password before saving the user.

  // Create user
  const user = await User.create({  //! this await is necessary to ensure we create the user before generating a token.
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT
  const token = generateToken({
    userId: user._id,
  });

  // Return response data
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUserService = async (email, password) => {
  // Find user
  const user = await User.findOne({ email }); //! this await is necessary to ensure we find the user before comparing passwords.

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // Compare password
  const isPasswordMatched = await bcrypt.compare( //! this await is necessary to ensure we compare the passwords before proceeding with login.
    password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  // Generate JWT
  const token = generateToken({
    userId: user._id,
  });

  // Return response data
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};