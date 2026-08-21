import { axiosInstance } from "@/api/axios";
import { GetMyProfileResponse } from "@/types/info";

export async function getMyProfile():Promise<GetMyProfileResponse> {
  const { data } = await axiosInstance.get("/fileserver/profile/my");
  return data;
}