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

export const getMyComplaints = (token) =>
  request("/api/complaint/my", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createComplaint = (token, complaintData) =>
  request("/api/complaint/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(complaintData),
  });

  export const getAdminComplaints = (token) =>
  request("/api/complaint/admin", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateComplaint = (token, id, complaintData) =>
  request(`/api/complaint/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(complaintData),
  });