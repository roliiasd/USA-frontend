const BACKEND_URL = "/cities";
const BACKEND_URL2 = "/animals";

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

export async function getCitiesByCounties(id) {
  const res = await fetch(`${BACKEND_URL}/citiesbycounty/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data?.error || `HTTP ${res.status}` };
  }

  return data;
}

export async function getFilteredAnim(id) {
  const res = await fetch(`${BACKEND_URL2}/filteredanimals/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({megye, varos})
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data?.error || `HTTP ${res.status}` };
  }

  return data;
}