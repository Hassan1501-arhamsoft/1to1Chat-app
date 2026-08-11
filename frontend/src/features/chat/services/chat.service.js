import api from "../../../api/axios";

export const getMessages = async (userId, page = 1) => {
  const response = await api.get(`/messages/${userId}`, {
    params: { page },
  });

  return response.data;
};