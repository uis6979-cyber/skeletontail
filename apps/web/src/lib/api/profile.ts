import { User } from "@/services/auth.api";
import { handleApiError } from "./handleApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserProfile extends Omit<User, "permissionsModule"> {
  phone?: string | null;
  birthDate?: string | null;
  gender?: "male" | "female" | "";
  language?: "es" | "en" | null;
  avatarUrl?: string | null;
}

/**
 * Retrieves the authenticated user's profile data.
 * Normalizes relative avatar paths into absolute URLs.
 */
export async function getProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/profile`, {
    credentials: "include",
  });

  if (!res.ok) await handleApiError(res);

  const data = await res.json();

  if (data.avatarUrl && !data.avatarUrl.startsWith("http")) {
    data.avatarUrl = `${API_URL}${data.avatarUrl}`;
  }

  return data;
}

/**
 * Uploads a new avatar file.
 */
export async function updateAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
  const res = await fetch(`${API_URL}/profile/avatar`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) await handleApiError(res);

  return res.json();
}

/**
 * Persists changes to profile metadata.
 */
export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) await handleApiError(res);

  return res.json();
}

/**
 * Updates the user password. 
 * Error keys returned by the API are normalized for localized UI feedback.
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const res = await fetch(`${API_URL}/profile/change-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) await handleApiError(res);

  return res.json();
}