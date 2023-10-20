"use client"
import React, { useEffect } from "react";
import Storage from "../utils/storage";

import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Storage.get("access_token");

    if (token != null && token.length > 0) {
      router.push("/dashboard", { scroll: false });
    } else {
      router.push("/auth/sign-up", { scroll: false });
    }
  }, [router])

  return (
    <main>
      <p>loading...</p>
    </main>
  );
}
