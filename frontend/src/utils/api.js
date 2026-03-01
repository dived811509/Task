import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (username, email, password, discordUsername) =>
  API.post("/auth/register", { username, email, password, discordUsername });

export const login = (email, password) =>
  API.post("/auth/login", { email, password });

export const getCurrentUser = () => API.get("/auth/me");

export const updateDiscord = (discordUsername) =>
  API.put("/auth/update-discord", { discordUsername });

export const createListing = (listing) => API.post("/listings", listing);

export const getListings = (category, sort) =>
  API.get(
    `/listings?${category ? `category=${category}` : ""}${sort ? `&sort=${sort}` : ""}`,
  );

export const getListing = (id) => API.get(`/listings/${id}`);

export const updateListing = (id, listing) =>
  API.put(`/listings/${id}`, listing);

export const deleteListing = (id) => API.delete(`/listings/${id}`);

export const voteListing = (listingId) => API.post(`/votes/${listingId}`);

export const checkVote = (listingId) => API.get(`/votes/${listingId}/check`);

export default API;
