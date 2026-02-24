"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "./dashboard/page";

export default function Home() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isloggedin") === "true";

    if (!isLoggedIn) {
      router.replace("/login");
    } else {
      setCheckedAuth(true);
    }
  }, [router]);

  if (!checkedAuth) {
    return null;
  }

  return (
    <Dashboard />
  );
}