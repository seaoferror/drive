import { create } from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "@/context/AuthContext";
import { refreshAccessToken } from "@/api/auth";

export const axiosInstance = create({
  adapter: "fetch",
  baseURL: `https://${process.env.EXPO_PUBLIC_API_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(async (config) => {
//   const token = getStoredAccessToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//
//   return config;
// });
//
// axiosInstance.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     if (error.response?.status) {
//       const originalRequest = error.config;
//
//       if (
//         error.response?.status === 401 &&
//         !originalRequest._retry &&
//         !originalRequest.url.includes("/refresh-token")
//       ) {
//         originalRequest._retry = true;
//         try {
//           const { accessToken } = await refreshAccessToken();
//           setStoredAccessToken(accessToken);
//           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//           return axiosInstance(originalRequest);
//         } catch (err) {
//           console.error("Refresh token failed", err);
//         }
//       }
//       return Promise.reject(error);
//     }
//   },
// );
