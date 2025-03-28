// src/utils/api.ts
import axios from "axios";

export const getAuthToken = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login ulang.");
    }
    return token;
};

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
