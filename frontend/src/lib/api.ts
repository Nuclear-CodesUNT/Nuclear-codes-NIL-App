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

// Get completed video IDs for current user
export async function fetchCompletedVideos(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/progress/completed`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch completed videos");
  const data = await res.json();
  return data.completedVideoIds || [];
}

// Mark a video as completed for current user
export async function setVideoCompleted(videoId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/progress/${videoId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: true }),
  });
  if (!res.ok) throw new Error("Failed to set video completed");
}