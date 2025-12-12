"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    console.log("📢[page.tsx:11]: support123: ", auth);
    if (auth === "true") {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}
