import Providers from "@/app/providers";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";
import TopRightButtons from "@/components/TopRightButtons";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopRightButtons/>
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}