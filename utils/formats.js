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
