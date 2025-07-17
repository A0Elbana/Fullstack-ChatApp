import axios from "axios";

// Create an axios instance with base URL and credentials
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:1502/api/v1" : "/api/v1",
    withCredentials: true,
});
