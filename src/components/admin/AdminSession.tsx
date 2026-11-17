"use client";
import { createContext, useContext } from "react";
import type { AdminRole } from "@/lib/admin-access";
export type AdminIdentity = { id: number; username: string; isSuperAdmin: boolean; role: AdminRole };
export const AdminSessionContext = createContext<AdminIdentity | null>(null);
export function useAdminSession() { return useContext(AdminSessionContext); }
