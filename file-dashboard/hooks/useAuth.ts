import { useMutation } from "@tanstack/react-query";
import { loginInWithEmail } from "@/api/auth";
import { AxiosError } from "axios";

export function useLoginWithEmail() {
  return useMutation({
    mutationFn: loginInWithEmail,
    onError: (error: AxiosError) => {
      console.log(error)
    },
  });
}
