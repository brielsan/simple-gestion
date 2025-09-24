export function validateAuthRequest(data) {
  const errors = {};

  if (!data.email) {
    errors.email = "The email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "The email is not valid";
  }

  if (!data.password) {
    errors.password = "The password is required";
  } else if (data.password.length < 6) {
    errors.password = "The password must have at least 6 characters";
  }

  if (data.username && data.username.length < 3) {
    errors.username = "The username must have at least 3 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateMovementRequest(data) {
  const errors = {};

  if (!data.amount) {
    errors.amount = "The amount is required";
  } else if (isNaN(data.amount)) {
    errors.amount = "The amount must be a valid number";
  }

  if (!data.description) {
    errors.description = "The description is required";
  } else if (data.description.length < 3) {
    errors.description = "The description must have at least 3 characters";
  }

  if (!data.categoryId) {
    errors.categoryId = "The category is required";
  }

  if (!data.typeId) {
    errors.typeId = "The type is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateFiltersRequest(data) {
  const errors = {};

  if (data.page && (isNaN(data.page) || data.page < 1)) {
    errors.page = "The page must be a number greater than 0";
  }

  if (data.limit && (isNaN(data.limit) || data.limit < 1 || data.limit > 100)) {
    errors.limit = "The limit must be a number between 1 and 100";
  }

  if (data.dateFrom && !isValidDate(data.dateFrom)) {
    errors.dateFrom = "The start date is not valid";
  }

  if (data.dateTo && !isValidDate(data.dateTo)) {
    errors.dateTo = "The end date is not valid";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
