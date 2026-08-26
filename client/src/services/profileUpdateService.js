const API_URL = import.meta.env.VITE_API_URL;

export const createProfileUpdateRequest = async (
  token,
  updateData,
) => {
  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(
    `${API_URL}/api/auth/profile-update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to send profile update request",
    );
  }

  return data;
};