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
  const dateObj = new Date(date);

  const utcDate = new Date(
    dateObj.getUTCFullYear(),
    dateObj.getUTCMonth(),
    dateObj.getUTCDate()
  );

  return utcDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
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

// format the date for display

export const createDateFromISO = (isoString) => {
  if (!isoString) return new Date();

  const datePart = isoString.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
};

export const extractDateComponents = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return { year, month, day };
};

export const formatDateForDisplay = (date) => {
  if (!date) return "";

  const { year, month, day } = extractDateComponents(date);
  return `${month}/${day}/${year}`;
};

export const convertUTCToLocalForCalendar = (utcDate) => {
  if (!utcDate) return null;

  const year = utcDate.getUTCFullYear();
  const month = utcDate.getUTCMonth();
  const day = utcDate.getUTCDate();

  return new Date(year, month, day);
};
