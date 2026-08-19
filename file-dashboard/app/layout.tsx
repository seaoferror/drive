import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/queryClient";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
    <body>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
    </body>
    </html>
  );
}
