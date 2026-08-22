import { axiosInstance } from "@/api/axios";
import {
  BlockExtensionRequest,
  GetBlockedExtensionsResponse,
  GetFileListResponse,
  UnblockExtensionRequest
} from "@/types/file";

export async function getBlockedExtensions(): Promise<
  GetBlockedExtensionsResponse[]
> {
  const { data } = await axiosInstance.get("/fileserver/extensions/blocked");
  return data;
}

export async function BlockExtension(body: BlockExtensionRequest) {
  const { data } = await axiosInstance.post(
    "/fileserver/extension/block",
    body
  );
  return data;
}

export async function UnblockExtension(body: UnblockExtensionRequest) {
  const { data } = await axiosInstance.patch(
    "/fileserver/extension/unblock",
    body
  );
  return data;
}

export async function uploadFile(
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/fileserver/upload", formData, {
    headers: {
      "Content-Type": undefined
    }
  });

  return data;
}

export async function getFileList(page = 1): Promise<GetFileListResponse[]> {
  const {data} = await  axiosInstance.get(
    `/fileserver/file/list?page=${page}`
  )
  return data;
}