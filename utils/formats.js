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

  const utcDate = new Date(
    dateObj.getUTCFullYear(),
    dateObj.getUTCMonth(),
    dateObj.getUTCDate()
  );

  switch (period) {
    case "weeks":
      return utcDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    case "days":
      return utcDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    default:
      return utcDate.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      });
  }
};

// format the key given by "useswr"; in some cases, it can be an array
// in those cases, the first element is the key.
export const formatSWRKey = (key) => {
  if (Array.isArray(key)) {
    return key?.[0];
  }
  return key;
};
