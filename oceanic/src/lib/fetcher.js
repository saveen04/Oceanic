export async function fetcher(url) {
  const res = await fetch(url, { credentials: "include" });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.error || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

