const BACKEND_URL = "/animals";

export async function loadpost() {
  const res = await fetch(`${BACKEND_URL}/getanimals`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data?.error || `HTTP ${res.status}` };
  }

  return Array.isArray(data.result) ? data.result : [];
}
