import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 30000, // 30 seconds to give server ample time to cold start since we're using Render Free Tier
});

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export const getReviews = async (includeHidden = false) => {
  if (includeHidden) {
    const token = localStorage.getItem("auth_token");
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }
  const res = await api.get(`/reviews/hostaway`, {
    params: { include_hidden: includeHidden },
  });

  return res.data.result;
};

export const hideReview = async (id: number) => {
  const res = await api.patch(`/reviews/${id}/hide`);
  return res.data;
};

export const showReview = async (id: number) => {
  const res = await api.patch(`/reviews/${id}/show`);
  return res.data;
};

export default api;
