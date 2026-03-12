import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // URL Backend Laragon kita
    withCredentials: true, // WAJIB TRUE agar session/cookie login tersimpan
});

export default axiosInstance;