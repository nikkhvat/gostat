"use client"
import { useEffect } from 'react';
import styles from './page.module.css' 

import Storage from "@/app/utils/storage";

import { useRouter } from "next/navigation";

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
    <main className={styles.home}>
    </main>
  )
}
