/**
 * Fetches the session data for the currently authenticated user.
 */
export async function getMe() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("common.messages.error");
  }

  return res.json();
}