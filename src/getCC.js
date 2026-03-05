const BACKEND_URL = "/cities";

export async function getCities() {
  const res = await fetch(`${BACKEND_URL}/allcities`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data?.error || `HTTP ${res.status}` };
  }

  return data;
}

export async function getCounties() {
  const res = await fetch(`${BACKEND_URL}/allcounties`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data?.error || `HTTP ${res.status}` };
  }

  return data;
}


