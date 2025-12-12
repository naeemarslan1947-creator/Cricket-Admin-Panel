"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    // Allow only login page when NOT auth
    if (!auth || auth !== "true") {
      if (pathname !== "/login") {
        router.replace("/dashboard");
      }
      return;
    }

    // If already authenticated, block access to login page
    if (auth === "true" && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [pathname]);

  return <>{children}</>;
}
