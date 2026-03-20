const BACKEND_URL = "/animals";

export async function loadpost() {
  const res = await fetch(`${BACKEND_URL}/allanimals`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { result: data?.error || `HTTP ${res.status}` };
  }
  const grouped = {};
  (data.result || []).forEach((row) => {
    if (!grouped[row.id]) {
      grouped[row.id] = {
        id: row.id,
        userId: row.userId,
        username: row.username,
        role: row.role,
        nev: row.nev,
        varos: row.varos,
        megjegyzes: row.megjegyzes,
        postcode: row.postcode,
        megye: row.megye,
        images: [],
      };
    }
    if (row.url) {
      grouped[row.id].images.push({ imageId: row.imageId, url: row.url });
    }
  });
  // console.log(grouped);
  return Object.values(grouped);
}

export async function createPost({
  nev,
  varos,
  megjegyzes,
  postcode,
  megye,
  files,
}) {
  try {
    const fd = new FormData();
    fd.append("nev", nev);
    fd.append("varos", varos);
    fd.append("megjegyzes", megjegyzes);
    fd.append("postcode", postcode);
    fd.append("megye", megye);

    files.forEach((file) => {
      fd.append("url", file);
    });

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
  } catch (err) {
    console.error("createPost hiba:", err);
    return { result: null, error: "Hálózati hiba történt" };
  }
}

export async function updatePost({
  animalId,
  imageId,
  nev,
  varos,
  megjegyzes,
  postcode,
  megye,
  file,
}) {
  const fd = new FormData();
  fd.append("animalId", animalId);
  fd.append("nev", nev);
  fd.append("varos", varos);
  fd.append("megjegyzes", megjegyzes);
  fd.append("postcode", postcode);
  fd.append("megye", megye);
  if (file) {
    fd.append("url", file);
  }

  const res = await fetch(`${BACKEND_URL}/updateanimal/${imageId}`, {
    method: "PUT",
    credentials: "include",
    body: fd,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { result: null, error: data?.error || `HTTP ${res.status}` };
  }

  return { result: data, error: null };
}

export async function delAnim(id) {
  const res = await fetch(`${BACKEND_URL}/deleteanimal/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { result: data?.error || `HTTP ${res.status}` };
  }

  return Array.isArray(data.result) ? data.result : [];
}
