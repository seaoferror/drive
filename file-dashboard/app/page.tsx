"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { refreshAccessToken } from "@/api/auth";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const wrapper = async () => {
        try {
          const { accessToken } = await refreshAccessToken();
          if(accessToken) {
            router.replace("/upload");
            return;
          }
        } catch {
          router.replace("/login");
        }
        return;
    }
    wrapper();
  }, []);

  return (
    <div></div>
  );
}