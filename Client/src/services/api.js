import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Auth services
export const authService = {
  login: async (credentials) => {
    return await api.post("/api/login", credentials);
  },

  register: async (userData) => {
    return await api.post("/api/register", userData);
  },

  logout: async () => {
    localStorage.removeItem("token");
    return await api.post("/api/logout");
  },

  verifyToken: async () => {
    return await api.get("/api/check");
  },
};

// Flight services
export const flightService = {
  getFlights: () => api.get("/api/flights"),
  saveFlight: (flightData) => api.post("/api/flights", flightData),
  updateFlight: (id, flightData) => api.put(`/api/flights/${id}`, flightData),
  deleteFlight: (id) => api.delete(`/api/flights/${id}`),
};

// Airport services
export const airportService = {
  getAirports: () => api.get("/api/airports/getairport"),
  saveAirport: (airportData) =>
    api.post("/api/airports/addairport", airportData),
  updateAirport: (id, airportData) =>
    api.put(`/api/airports/updateairport/${id}`, airportData),
  deleteAirport: (icao) => api.delete(`/api/airports/deleteairport/${icao}`),
  getAirportByICAO: (icao) => api.get(`/api/airports/getairport/${icao}`),
};

// Admin services
export const adminService = {
  getUsers: () => api.get("/api/admin/users"),
  updateUser: (id, userData) => api.put(`/api/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getSettings: () => api.get("/api/admin/settings"),
  updateSettings: (settings) => api.put("/api/admin/settings", settings),
};

export const userService = {
  getCurrentUser: async () => {
    return await api.get("/api/users/me");
  },

  updateProfile: async (userData) => {
    return await api.put("/api/users/profile", userData);
  },
};

export default api;
