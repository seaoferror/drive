import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/info";
import { queryKey } from "@/constants";

export function useGetMyProfile() {
  return useQuery({
    queryFn: getMyProfile,
    queryKey: [queryKey.GET_MY_ID]
  })
}