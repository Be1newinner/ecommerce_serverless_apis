"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "./axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me");
        return res.data.user as User;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      window.location.href = "/";
    },
  });
  // const router = useRouter();

  useEffect(() => {
    const handleGlobalLogout = () => {
      queryClient.setQueryData(["auth-user"], null);
      if (
        window.location.pathname !== "/auth/signin" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/auth/signin";
      }
    };
    window.addEventListener("axios-auth-logout", handleGlobalLogout);

    return () => {
      window.removeEventListener("axios-auth-logout", handleGlobalLogout);
    };
  }, [queryClient]);

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
