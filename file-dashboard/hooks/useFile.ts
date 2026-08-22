import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlockExtension, getBlockedExtensions, getFileList, UnblockExtension } from "@/api/file";
import { queryKey } from "@/constants";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useGetBlockedExtensions() {
  return useQuery({
    queryFn: getBlockedExtensions,
    queryKey: [queryKey.GET_BLOCKED_EXTENSIONS]
  });
}

export function useBlockExtension() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BlockExtension,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey.GET_BLOCKED_EXTENSIONS]
      });
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { message?: string } | undefined;
      console.log(data?.message);
      toast.error(data?.message ?? "처리 중 오류가 발생했습니다, 잠시 후 다시 시도해 주세요.");
    }
  });
}

export function useUnblockExtension() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UnblockExtension,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKey.GET_BLOCKED_EXTENSIONS]
      });
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { message?: string } | undefined;
      console.log(data?.message);
      toast.error(
        data?.message ??
        "처리 중 오류가 발생했습니다, 잠시 후 다시 시도해 주세요."
      );
    }
  });
}

export function useGetFileList() {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getFileList(pageParam),
    queryKey: [queryKey.GET_FILE_LIST],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const lastPost = lastPage[lastPage.length - 1];
      return lastPost ? allPages.length + 1 : undefined;
    },
  });
}