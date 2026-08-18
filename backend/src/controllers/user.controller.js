import { getAllUsers } from "../services/user.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const users = await getAllUsers(  //! this await is necessary to ensure we retrieve the users before returning them.
      req.user.id,
      search
    );

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};