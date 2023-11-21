"use client"
import React, { useEffect, ReactNode } from "react";
import Storage from "@/app/utils/storage";

interface ThemeWrapperProps {
  children: ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window === "undefined") return;

      const savedTheme = Storage.get("theme");

      if (savedTheme !== "dark" && savedTheme !== "light") {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          document.body.dataset.theme = "dark";
        } else {
          document.body.dataset.theme = "light";
        }
      } else {
        document.body.dataset.theme = savedTheme;
      }
    };

    checkTheme();

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      document.body.dataset.theme = newTheme;
      Storage.set("theme", newTheme);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <>{children}</>;
};

export default ThemeWrapper;
