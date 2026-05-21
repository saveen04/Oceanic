"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export function useMe() {
  const { data, error, isLoading, mutate } = useSWR("/api/auth/me", fetcher);
  return {
    user: data?.user ?? null,
    isLoading,
    error,
    mutate,
    isAuthed: Boolean(data?.user),
  };
}

