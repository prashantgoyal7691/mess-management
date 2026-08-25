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

export const fetchSystemDate = async () => {
  const res = await fetch(`${API_URL}/api/system/date`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch system date");
  }

  return data;
};

export const fetchAdminWeeklyMenu = async (token) => {
  if (!token) {
    throw new Error("Missing admin token");
  }

  const res = await fetch(`${API_URL}/api/admin/menu/week`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch admin weekly menu");
  }

  return data;
};

export const saveAdminMenu = async (token, menus) => {
  if (!token) {
    throw new Error("Missing admin token");
  }

  const res = await fetch(`${API_URL}/api/admin/menu/week`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      menus,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to save weekly menu");
  }

  return data;
};