const API_URL = import.meta.env.VITE_API_URL;

async function request(url, options) {
  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}


// Student Authentication

export const studentLogin = (credentials) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const studentSignup = (payload) =>
  request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const verifyStudentOtp = (payload) =>
  request("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const studentForgotPassword = (payload) =>
  request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const studentResetPassword = (payload) =>
  request("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const withdrawPendingRequest = (payload) =>
  request("/api/auth/withdraw-pending", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Admin Authentication

export const adminLogin = (payload) =>
  request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminSendOtp = (payload) =>
  request("/api/admin/send-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminVerifyOtp = (payload) =>
  request("/api/admin/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminForgotPassword = (payload) =>
  request("/api/admin/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminResetPassword = (payload) =>
  request("/api/admin/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });