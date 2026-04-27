import { handleApiError } from "@/lib/api/handleApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Fetches all roles defined in the system for administrative management.
 */
export async function getRoles() {
  const res = await fetch(`${API_URL}/roles`, { credentials: "include" });

  if (!res.ok) await handleApiError(res);

  return res.json();
}

/**
 * Toggles the activation status for a specific role.
 * Server-side integrity checks prevent disabling roles with active user assignments.
 */
export async function toggleRoleStatus(id: string) {
  const res = await fetch(`${API_URL}/roles/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) await handleApiError(res);

  return res.json();
}

/**
 * Provisions a new system role and its associated permission mappings.
 */
export async function createRole(data: {
  name: string;
  slug: string;
  description?: string;
  permissions?: string[];
}) {
  const res = await fetch(`${API_URL}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) await handleApiError(res);

  return res.json();
}

/**
 * Updates the metadata and permission relationships for an existing role.
 */
export async function updateRole(id: string, data: Record<string, any>) {
  const res = await fetch(`${API_URL}/roles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) await handleApiError(res);

  return res.json();
}

/**
 * Retrieves a specific role by ID, including current permission IDs.
 */
export async function getRoleById(id: string) {
  const res = await fetch(`${API_URL}/roles/${id}`, { credentials: "include" });

  if (!res.ok) await handleApiError(res);

  return res.json();
}