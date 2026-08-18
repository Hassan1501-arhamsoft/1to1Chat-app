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

  const users = await User.find(filter).select("-password"); //! this await is necessary to ensure we retrieve the users before returning them.

  return users;
};