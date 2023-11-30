"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import Storage from "@/app/shared/libs/storage";


export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Storage.get("access_token");

    if (token != null && token.length > 0) {
      router.push("/dashboard", { scroll: false });
    } else {
      router.push("/auth/sign-in", { scroll: false });
    }
  }, [router]);

  return (
    <main>
      <p>loading...</p>
    </main>
  );
}
