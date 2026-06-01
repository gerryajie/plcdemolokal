import axios from "axios";

// Check if running in Electron
const isElectron = () => {
  return (
    typeof window !== "undefined" &&
    Boolean(window.electronAPI)
  );
};

// Get API base URL
const getApiBaseUrl = async () => {
  if (isElectron() && window.electronAPI) {
    try {
      const backendUrl =
        await window.electronAPI.getBackendUrl();
      return backendUrl;
    } catch (error) {
      console.error(
        "Failed to get backend URL from Electron:",
        error
      );
    }
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    throw new Error(
      "VITE_API_BASE_URL is not configured"
    );
  }
  return envUrl;
};

export const API_BASE_URL = await getApiBaseUrl();

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default api;
