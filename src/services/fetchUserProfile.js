import axios from "axios";

export const fetchUserProfile = async (token) => {
  try {
    const response = await axios.get("https://localhost:7079/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Не удалось загрузить профиль.";
  }
};