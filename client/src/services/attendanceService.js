const API_URL = import.meta.env.VITE_API_URL;

export const fetchMonthlyAttendance = async ({
  userId,
  month,
  token,
}) => {
  if (!userId || !month || !token) {
    throw new Error("Missing attendance request data");
  }

  const res = await fetch(
    `${API_URL}/api/meal/monthly?userId=${userId}&month=${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch attendance",
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid attendance response");
  }

  return data;
};