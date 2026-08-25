const API_URL = import.meta.env.VITE_API_URL;

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const getMealCount = (token) =>
  request("/api/admin/meal-count", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });