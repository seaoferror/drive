import { useMutation } from "@tanstack/react-query";
import { loginInWithEmail, logout } from "@/api/auth";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useLoginWithEmail() {
  return useMutation({
    mutationFn: loginInWithEmail,
    onError: (error: AxiosError) => {
      toast.error(String(error.response?.data));
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    onError: (error: AxiosError) => {
      toast.error(String(error.response?.data))
    }
  })
}