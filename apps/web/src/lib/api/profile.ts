const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Retrieves the user profile and normalizes the avatar URL.
 */
export async function getProfile() {
  const res = await fetch(`${API_URL}/profile`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("profile.messages.errors.fetchFailed");
  }

  const data = await res.json();
  
  if (data.avatarUrl && !data.avatarUrl.startsWith("http")) {
    data.avatarUrl = `${API_URL}${data.avatarUrl}`;
  }

  return data;
}

/**
 * Updates the user avatar. 
 * Manual headers are omitted to allow the browser to correctly set the multipart boundary.
 */
export async function updateAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

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