const BACKEND_URL = "/animals";

export async function loadpost() {
  const res = await fetch(`${BACKEND_URL}/getanimals`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { result: data?.error || `HTTP ${res.status}` };
  }

  return Array.isArray(data.result) ? data.result : [];
}

export async function createPost({
  nev,
  varos,
  megjegyzes,
  postcode,
  megye,
  file,
}) {
  const fd = new FormData();
  fd.append("nev", nev);
  fd.append("varos", varos);
  fd.append("megjegyzes", megjegyzes);
  fd.append("postcode", postcode);
  fd.append("megye", megye);
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
export async function updatePost({
  id,
  nev,
  varos,
  megjegyzes,
  poscode,
  megye,
  file,
}) {
  const fd = new FormData();
  fd.append("nev", nev);
  fd.append("varos", varos);
  fd.append("megjegyzes", megjegyzes);
  fd.append("poscode", poscode);
  fd.append("megye", megye);
  if (file) {
    fd.append("kep", file);
  }
  const res = await fetch(`${BACKEND_URL}/`)
}
