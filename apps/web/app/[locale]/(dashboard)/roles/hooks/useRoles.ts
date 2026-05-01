"use client";

import { useCallback, useEffect, useState } from "react";
import { getRoles } from "../services/roles.api";

export type Role = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
};

export interface Permission {
  id: string;
  name: string;
  module?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Orchestrates system roles data fetching and state synchronization.
 */
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Roles hook fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    refresh: fetchRoles,
    setRoles,
  };
}

/**
 * Handles retrieval of active system permissions for role assignment.
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/roles/permissions`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("roles.messages.errors.fetchPermissionsFailed");
      }

      const data = await res.json();
      setPermissions(data);
    } catch (err) {
      console.error("Permissions hook fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return { permissions, loading, refresh: fetchPermissions };
}