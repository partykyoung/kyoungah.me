async function apiInstance<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, options);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}

export { apiInstance };
