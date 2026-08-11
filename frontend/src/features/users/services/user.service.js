import api from "../../../api/axios";

// Get all users
export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

// Search users
export const searchUsers = async (search) => {
  const response = await api.get("/users", {
    params: {
      search,
    },
  });

  return response.data;
};