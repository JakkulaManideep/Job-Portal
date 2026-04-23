const baseFromEnv = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (baseFromEnv || "http://localhost:3000").replace(/\/$/, "");

const toAbsoluteUrl = (path) => `${API_BASE_URL}${path}`;

const getClerkToken = async () => {
  if (typeof window === "undefined") return null;

  const clerk = window.Clerk;
  if (!clerk?.loaded) return null;

  if (!clerk.session) return null;

  return clerk.session.getToken();
};

export const apiRequest = async (path, options = {}) => {
  const token = await getClerkToken();

  const response = await fetch(toAbsoluteUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.message) ||
      (typeof data === "string" && data) ||
      "Request failed";

    throw new Error(message);
  }

  return data;
};