import api from "./api";

export const changePassword = async (payload) => {
  const res =
    await api.patch(
      "/auth/change-password",
      payload
    );

  return res.data;
};
