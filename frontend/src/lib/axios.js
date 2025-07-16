import axios from "axios";

// Create an axios instance with base URL and credentials
export const axiosInstance = axios.create({
    baseURL: "http://localhost:1502/api/v1",
    withCredentials: true,
});
