import { axiosInstance } from "@/api/axios";
import { LoginWithEmailResponse, SignInWithEmailRequest } from "@/types/auth";

export async function loginInWithEmail(
  body: SignInWithEmailRequest,
): Promise<LoginWithEmailResponse> {
  const { data } = await axiosInstance.post("/auth/email/login", body);
  return data;
}


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