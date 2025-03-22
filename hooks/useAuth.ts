"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(role: "admin" | "customer") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/login");
    if (session?.user.role !== role) router.push("/");
  }, [session, status, router]);

  return session;
}
