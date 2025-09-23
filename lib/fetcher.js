export const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const fetcherWithParams = async (url, params = {}) => {
  const searchParams = new URLSearchParams(params);
  const fullUrl = `${url}?${searchParams.toString()}`;
  return fetcher(fullUrl);
};
