const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProfile() {
  const res = await fetch(`${API_URL}/profile`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("profile.messages.errors.fetchFailed");
  }

  const data = await res.json();

  // Ensure absolute URL for relative asset paths returned by the API
  if (data.avatarUrl && !data.avatarUrl.startsWith("http")) {
    data.avatarUrl = `${API_URL}${data.avatarUrl}`;
  }

  return data;
}

/**
 * Note: Boundary headers for multipart/form-data are handled automatically by the browser.
 */
export async function updateAvatar(formData: FormData) {
  const res = await fetch(`${API_URL}/profile/avatar`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("profile.messages.errors.updateAvatarFailed");
  }

  return res.json();
}

export async function updateProfile(data: Record<string, any>) {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("profile.messages.errors.updateProfileFailed");
  }

  return res.json();
}