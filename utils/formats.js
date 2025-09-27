export const formatMoney = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatCapitalize = (string) => {
  if (!string || typeof string !== "string") return "";
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatTimelineDate = (date, period) => {
  const dateObj = new Date(date);
  switch (period) {
    case "weeks":
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "days":
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    default:
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
      });
  }
};
