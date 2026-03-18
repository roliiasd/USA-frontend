const BACKEND_URL = "/messages";

export async function deleteMessages(messageId) {
  const res = await fetch(`${BACKEND_URL}/deleteown/${messageId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data?.error };
  }
  return await res.json();
}
