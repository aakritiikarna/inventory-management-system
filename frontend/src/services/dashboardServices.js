import axios from "axios";

const API = "http://localhost:3000/api/dashboard";

export const getDashboardStats = async () => {
  const token = localStorage.getItem("pos-token");

  const response = await axios.get(`${API}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};