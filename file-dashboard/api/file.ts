import { axiosInstance } from "@/api/axios";
import { BlockExtensionRequest, GetBlockedExtensionsResponse, UnblockExtensionRequest } from "@/types/file";

export async function getBlockedExtensions(): Promise<GetBlockedExtensionsResponse[]> {
  const { data } = await axiosInstance.get("/fileserver/extensions/blocked");
  return data;
}

export async function BlockExtension(body: BlockExtensionRequest) {
  const { data } = await axiosInstance.post("/fileserver/extension/block", body);
  return data;
}

export async function UnblockExtension(body: UnblockExtensionRequest) {
  const { data } = await axiosInstance.patch("/fileserver/extension/unblock", body);
  return data;
}