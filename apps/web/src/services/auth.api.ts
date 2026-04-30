const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  permissionsModule: string[];
  image?: string;
  role?: string;
}

/**
 * Retrieves the current session user data.
 * Includes credentials to ensure HttpOnly cookies are transmitted.
 */
export async function getMe(): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("common.messages.userNotFound");
  }

  return response.json() as Promise<User>;
}