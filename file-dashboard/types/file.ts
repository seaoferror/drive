export interface BlockExtensionRequest {
  name: string;
}

export interface GetBlockedExtensionsResponse {
  id: string;
  name: string;
}

export interface UnblockExtensionRequest {
  id: string;
}

export interface GetFileListResponse {
  id: string;
  name: string;
  url: string
}