import User from "../models/user.model.js";

export const getAllUsers = async (currentUserId, search = "") => {
  const filter = {
    _id: { $ne: currentUserId },
  };

  // Search by name
  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  const users = await User.find(filter).select("-password");

  return users;
};