"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsers } from "../services/users.api";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  isActive: boolean;
  createdAt: string;
};

export interface Permission {
  id: string;
  name: string;
  module?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Orchestrates system users data fetching and state synchronization.
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Users hook fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    refresh: fetchUsers,
    setUsers,
  };
}

/**
 * Handles retrieval of active system roles for role assignment.
 */
export function useRoles() {
  const [roles, setRoles] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/roles`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("users.messages.errors.fetchRolesFailed");
      }

      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error("Roles hook fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, loading, refresh: fetchRoles };
}