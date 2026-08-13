const API_URL = import.meta.env.VITE_API_URL;

export const fetchWeeklyMenu = async (messId, token) => {
  if (!messId || !token) {
    throw new Error("Missing messId or token");
  }

  const res = await fetch(
    `${API_URL}/api/admin/menu/student/week?messId=${messId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch weekly menu");
  }

  return data;
};

export const fetchMyMealPlans = async (userId, token) => {
  if (!userId || !token) {
    throw new Error("Missing userId or token");
  }
  const res = await fetch(
    `${API_URL}/api/meal/my?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch meal plans");
  }

  const formatted = {};

  data.forEach((plan) => {
    const key = `${plan.date}-${plan.meal}`;
    formatted[key] = plan.status;
  });

  return formatted;
};

export const saveMealPlan = async ({
  userId,
  token,
  date,
  meal,
  status,
}) => {
  if (!userId || !token || !date || !meal || !status) {
    throw new Error("Missing meal plan data");
  }

  const res = await fetch(`${API_URL}/api/meal/set`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      date,
      meal,
      status,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to save meal plan");
  }

  return data;
};