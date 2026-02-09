import axios from "axios";

const axiosInstance = axios.create({
  timeout: 50000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default axiosInstance;
