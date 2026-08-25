const API_URL = import.meta.env.VITE_API_URL;

export const fetchMonthlyBill = async ({
  month,
  token,
}) => {
  if (!month || !token) {
    throw new Error("Missing billing request data");
  }

  const res = await fetch(
    `${API_URL}/api/billing/monthly-summary?month=${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch monthly bill",
    );
  }

  return data;
};

export const downloadInvoice = async ({
  month,
  token,
}) => {
  if (!month || !token) {
    throw new Error("Missing invoice request data");
  }

  const response = await fetch(
    `${API_URL}/api/billing/invoice/${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Invoice not available");
  }

  return response.blob();
};

export const setDailyExpense = async ({
  token,
  breakfastCost,
  lunchCost,
  dinnerCost,
}) => {
  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(
    `${API_URL}/api/billing/set-expense`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        breakfastCost,
        lunchCost,
        dinnerCost,
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to save expense",
    );
  }

  return data;
};

export const fetchExpenseHistory = async (token) => {
  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(
    `${API_URL}/api/billing/expense-history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch expense history",
    );
  }

  return data;
};