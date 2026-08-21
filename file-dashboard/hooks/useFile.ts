import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlockExtension, getBlockedExtensions, UnblockExtension } from "@/api/file";
import { queryKey } from "@/constants";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useGetBlockedExtensions() {
  return useQuery({
    queryFn: getBlockedExtensions,
    queryKey: [queryKey.GET_BLOCKED_EXTENSIONS],
  });
}

export function useBlockExtension() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BlockExtension,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey.GET_BLOCKED_EXTENSIONS],
      });
    },
    onError: (error: AxiosError) => {
      toast.error(String(error.response?.data));
    },
  });
}

export function useUnblockExtension() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UnblockExtension,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey.GET_BLOCKED_EXTENSIONS],
      });
    },
    onError: (error: AxiosError) => {
      toast.error(String(error.response?.data));
    },
  });
}