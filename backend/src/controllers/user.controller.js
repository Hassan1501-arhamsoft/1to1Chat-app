import { getAllUsers } from "../services/user.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const users = await getAllUsers(
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