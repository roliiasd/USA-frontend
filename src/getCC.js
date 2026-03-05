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

export async function createPost({ nev, varos, megjegyzes, postcode, file }) {
  const fd = FormData();
  fd.append("nev", nev);
  fd.append("varos", varos);
  fd.append("megjegyzes", megjegyzes);
  fd.append("postcode", postcode);
  if (file) fd.append("kep", file);
  const res = await fetch(`${BACKEND_URL}/addanimal`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { result: null, error: data?.error || `HTTP ${res.status}` };
  }

  return { result: data, error: null };
}
