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