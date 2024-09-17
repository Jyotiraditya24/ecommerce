import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${window.location.origin}/api`,
  withCredentials: true, // send cookies with requests
});

export default axiosInstance;
