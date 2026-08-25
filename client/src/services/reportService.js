const API_URL = import.meta.env.VITE_API_URL;
export const fetchTodayReport = async (token) => {
  if (!token) {
    throw new Error("Missing admin token");
  }

  const res = await fetch(
    `${API_URL}/api/admin/report/today`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch today's report",
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid report response");
  }

  return data;
};

export const fetchReportServerDate = async () => {
  const res = await fetch(
    `${API_URL}/api/system/date`,
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch server date",
    );
  }

  return data;
};

export const fetchStudentHistory = async (
  token,
  studentId,
  month,
) => {
  if (!token) {
    throw new Error("Missing admin token");
  }

  if (!studentId) {
    throw new Error("Missing student ID");
  }

  const url = month
    ? `${API_URL}/api/admin/student-history/${studentId}?month=${month}`
    : `${API_URL}/api/admin/student-history/${studentId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch student history",
    );
  }

  return data;
};

export const downloadStudentHistoryPDF = async (
  token,
  studentId,
  month,
) => {
  if (!token) {
    throw new Error("Missing admin token");
  }

  const url = month
    ? `${API_URL}/api/admin/student-history-pdf/${studentId}?month=${month}`
    : `${API_URL}/api/admin/student-history-pdf/${studentId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = "Failed to download PDF";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // PDF/error response could not be parsed as JSON
    }

    throw new Error(message);
  }

  return await res.blob();
};