"use client";

import { useEffect } from "react";
import { useGetMyProfile } from "@/hooks/useInfo";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RootPage() {
  const { accessToken } = useAuth();
  const { data } = useGetMyProfile();
  const router = useRouter();
  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (data?.role == "admin") {
      router.replace("/policy");
      return;
    }
    router.replace("/upload");
  }, [data, accessToken]);

  return (
    <div></div>
  );
}