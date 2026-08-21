"use client";

import { useEffect } from "react";
import { useGetMyProfile } from "@/hooks/useInfo";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const { data, isLoading, isError } = useGetMyProfile();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!data || isError) {
      router.replace("/login");
      return;
    }
    if (data.role == "admin") {
      router.replace("/policy");
      return;
    }
    router.replace("/upload");
  }, [data, isLoading, isError]);

  return (
    <div></div>
  );
}