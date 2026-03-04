const BACKEND_URL = "/animals";
export async function loadpost(){
    const res = await fetch(`${BACKEND_URL}/getanimals`, {
        method: 'GET',
        credentials: 'include'
    })
    if (!res.ok) {
        const data = await res.json()
        return {error: data?.error}
    }
    return await res.json()

  }