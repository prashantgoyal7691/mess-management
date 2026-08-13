export const getSystemDate = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/system/date`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch server date");
  }

  return await res.json();
};