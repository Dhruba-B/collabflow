import axios from "axios";
import { showErrorSnackbar } from "../../store/snackbarStore";

export const api = axios.create({
  baseURL: "https://collabflow-luhs.onrender.com/api",
});

const getApiErrorMessage = (error) => {
  const serverMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error;

  if (serverMessage) {
    return serverMessage;
  }

  if (error?.response?.status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (error?.response?.status >= 500) {
    return "Something went wrong on the server. Please try again.";
  }

  if (error?.message === "Network Error") {
    return "Cannot reach the server. Check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error?.config?.silentSnackbar) {
      showErrorSnackbar(getApiErrorMessage(error));
    }

    return Promise.reject(error);
  }
);
