export const getServerDate = (req, res) => {
  const indiaNow = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );

  const today = indiaNow.toLocaleDateString("en-CA");

  const tomorrow = new Date(indiaNow);
  tomorrow.setDate(tomorrow.getDate() + 1);

  res.json({
    today,
    lockDate: tomorrow.toLocaleDateString("en-CA"),
  });
};
