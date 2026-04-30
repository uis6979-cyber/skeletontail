import { handleApiError } from "@/lib/api/handleApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Fetches all system users for administrative management.
 */
export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, { credentials: "include" });
  if (!response.ok) await handleApiError(response);
  return response.json();
}

/**
 * Toggles user active status. 
 * Backend constraints may prevent disabling users with active dependencies.
 */
export async function toggleUserStatus(id: string) {
  const response = await fetch(`${API_URL}/users/${id}/toggle`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!response.ok) await handleApiError(response);
  return response.json();
}

/**
 * Registers a new user and assigns initial roles/permissions.
 */
export async function createUser(data: Record<string, any>) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) await handleApiError(response);
  return response.json();
}

/**
 * Updates an existing user's metadata and role relationships.
 */
export async function updateUser(id: string, data: Record<string, any>) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) await handleApiError(response);
  return response.json();
}

/**
 * Retrieves a single user record by ID.
 */
export async function getUserById(id: string) {
  const response = await fetch(`${API_URL}/users/${id}`, { credentials: "include" });
  if (!response.ok) await handleApiError(response);
  return response.json();
}

/**
 * Updates the password for a specific user account.
 */
export async function changeUserPassword(
  userId: string,
  data: Record<string, any>
) {
  const response = await fetch(`${API_URL}/users/${userId}/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) await handleApiError(response);
  return response.json();
}