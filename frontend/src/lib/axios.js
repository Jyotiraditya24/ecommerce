import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true, // send cookies with requests
});

export default axiosInstance;
