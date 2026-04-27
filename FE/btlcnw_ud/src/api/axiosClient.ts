import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json"
  }
});

const decodeJwtExp = (token: string): number | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = JSON.parse(atob(padded));
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const exp = decodeJwtExp(token);
  if (exp === null) return false;
  return Date.now() >= exp * 1000;
};

let isLoggingOut = false;

const forceLogout = (reason: string) => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/login") {
    const message = encodeURIComponent(reason);
    window.location.replace(`/login?sessionExpired=1&reason=${message}`);
  }
};

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    if (isTokenExpired(token)) {
      forceLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return Promise.reject(
        new axios.Cancel("Token expired — request cancelled")
      );
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      forceLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
