const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchTestMessage() {
  const res = await fetch(`${API_BASE}/api/test`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

// Add more API functions as needed
export async function loginUser(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}