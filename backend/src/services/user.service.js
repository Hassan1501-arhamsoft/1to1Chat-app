import { Op } from "sequelize";
import User from "../models/user.model.js";

export const getAllUsers = async (currentUserId, search = "") => {
  const whereClause = {
    id: { [Op.ne]: currentUserId },
  };

  if (search) {
    whereClause.name = { [Op.like]: `%${search}%` };
  }

  const users = await User.findAll({
    where: whereClause,
    attributes: { exclude: ["password"] },
  });

  // Map id to _id so frontend bindings work seamlessly
  return users.map((u) => {
    const data = u.toJSON();
    data._id = data.id;
    return data;
  });
};





// import User from "../models/user.model.js";

// export const getAllUsers = async (currentUserId, search = "") => {
//   const filter = {
//     _id: { $ne: currentUserId },
//   };

//   // Search by name
//   if (search) {
//     filter.name = {
//       $regex: search,
//       $options: "i",
//     };
//   }

//   const users = await User.find(filter).select("-password"); //! this await is necessary to ensure we retrieve the users before returning them.
  
//   return users;
// };