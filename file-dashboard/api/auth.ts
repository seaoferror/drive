import { axiosInstance } from "@/api/axios";

export async function refreshAccessToken(): Promise<{ accessToken: string }> {
  try {
    const { data } = await axiosInstance.post("/auth/refresh-token");
    return data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Failed to refresh access token";
    throw new Error(message);
  }
}