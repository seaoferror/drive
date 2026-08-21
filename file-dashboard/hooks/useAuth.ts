import { useMutation } from "@tanstack/react-query";
import { loginInWithEmail, logout } from "@/api/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useLoginWithEmail() {
  return useMutation({
    mutationFn: loginInWithEmail,
    onError: (error: AxiosError) => {
      const data = error.response?.data as { message?: string } | undefined;
      console.log(data?.message);
      toast.error(
        data?.message ??
          "처리 중 오류가 발생했습니다, 잠시 후 다시 시도해 주세요.",
      );
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    onError: (error: AxiosError) => {
      const data = error.response?.data as { message?: string } | undefined;
      console.log(data?.message);
      toast.error(
        data?.message ??
          "처리 중 오류가 발생했습니다, 잠시 후 다시 시도해 주세요.",
      );
    },
  });
}