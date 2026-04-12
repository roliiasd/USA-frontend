const BACKEND_URL = "/users"; //Dani hoki lmao // peti is lmao

export async function register(email, username, psw) {
  const res = await fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, psw }),
  });
  const data = await res.json();
  if (data.error) {
    return data;
  }
  return data;
}

export async function login(email, psw) {
  const res = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, psw }),
  });
  const data = await res.json();
  if (data.error) {
    return data;
  }
  return data;
}
export async function logout() {
  const res = await fetch(`${BACKEND_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout hiba");
  }

  localStorage.removeItem("userId");
  return await res.json();
}

export async function forgotPassword(email, newPassword) {
  const res = await fetch(`${BACKEND_URL}/passwordforget`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  console.log("response", res);

  return res.json();
}

export async function whoami() {
  const res = await fetch(`${BACKEND_URL}/whoami`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data?.error };
  }
  return await res.json();
}

export async function allUsers() {
  const res = await fetch(`${BACKEND_URL}/allusers`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data?.error };
  }
  return await res.json();
}

export async function editName(username) {
  const res = await fetch(`${BACKEND_URL}/editname`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nev: username }),
  });
  const data = await res.json();
  if (data.error) {
    return data;
  }
  return data;
}
export async function editPassword(psw) {
  const res = await fetch(`${BACKEND_URL}/editpass`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ psw: psw }),
  });
  const data = await res.json();
  if (data.error) {
    return data;
  }
  return data;
}

export async function chatPartners() {
  const res = await fetch(`${BACKEND_URL}/chat-partners`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data?.error };
  }
  return await res.json();
}

export async function roleChange(userId, newRole) {
  const res = await fetch(`${BACKEND_URL}/editrole/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role: newRole }),
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data?.error || "Ismeretlen hiba" };
  }
  return await res.json();
}
