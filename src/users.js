const BACKEND_URL = "http://localhost:4000/users";

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
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({email, psw})
    
  });
  const data = await res.json()
  if (data.error) {
    return data
  }
  return data
}
export async function logout() {
  const res = await fetch(`${BACKEND_URL}/logout`, {
    method: "POST",
    credentials: "include"
  })

  if (!res.ok) {
    throw new Error("Logout hiba")
  }

  return await res.json()
}