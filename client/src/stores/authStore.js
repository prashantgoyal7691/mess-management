import { create } from "zustand";

export const useAuthStore = create((set) => ({
  studentToken: localStorage.getItem("studentToken"),
  user: JSON.parse(localStorage.getItem("user") || "null"),

  adminToken: localStorage.getItem("adminToken"),
  admin: JSON.parse(localStorage.getItem("admin") || "null"),

  loginStudent: (data) => {
    localStorage.setItem("studentToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    set({
      studentToken: data.token,
      user: data.user,
    });
  },

  logoutStudent: () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("user");

    set({
      studentToken: null,
      user: null,
    });
  },

  loginAdmin: (data) => {
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));

    set({
      adminToken: data.token,
      admin: data.admin,
    });
  },

  logoutAdmin: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    set({
      adminToken: null,
      admin: null,
    });
  },
}));