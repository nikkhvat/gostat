"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Storage from "@/app/shared/libs/storage";

import styles from "./page.module.css";



export default function Home() {
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
    <main className={styles.home}></main>
  );
}
