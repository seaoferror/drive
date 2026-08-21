"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CustomButton from "@/components/CustomButton";
import * as stylex from "@stylexjs/stylex";
import { useLogout } from "@/hooks/useAuth";
import { useGetMyProfile } from "@/hooks/useInfo";

export default function TopRightButtons() {
  const pathname = usePathname();
  const logoutMutation = useLogout();
  const router = useRouter();
  const { data } = useGetMyProfile();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (data?.role === "admin") {
      setIsAdmin(true);
    }
  }, [data]);

  if (pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.replace("/login"),
    });
  };

  const handleAdminToggleRoute = () => {
    if(pathname === "/policy") {
      router.push("/file");
      return;
    }
    router.push("/policy");
  };

  return (
    <div {...stylex.props(styles.logoutWrapper)}>
      {isAdmin && (
        <CustomButton
          label={pathname === "/policy" ? "File" : "Policy"}
          size="medium"
          variant="filled"
          onPress={handleAdminToggleRoute}
        />
      )}
      <CustomButton
        label="Logout"
        size="medium"
        variant="outlined"
        onPress={handleLogout}
        disabled={logoutMutation.isPending}
      />
    </div>
  );
}

const styles = stylex.create({
  logoutWrapper: {
    position: "absolute",
    top: "16px",
    right: "20px",
    zIndex: 50,
    display: "flex",
    flexDirection: "row",
    gap: "12px",
  },
});
