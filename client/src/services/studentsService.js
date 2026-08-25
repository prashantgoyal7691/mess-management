const API_URL = import.meta.env.VITE_API_URL;

export const fetchStudents = async (token) => {
  if (!token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(`${API_URL}/api/admin/students`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch students");
  }

  return data;
};

export const approveStudent = async (token, studentId) => {
  const res = await fetch(
    `${API_URL}/api/admin/approve-student/${studentId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to approve student");
  }

  return data;
};

export const rejectStudent = async (token, studentId) => {
  const res = await fetch(
    `${API_URL}/api/admin/reject-student/${studentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to reject student");
  }

  return data;
};

export const deleteStudent = async (token, studentId) => {
  const res = await fetch(
    `${API_URL}/api/admin/delete-student/${studentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete student");
  }

  return data;
};