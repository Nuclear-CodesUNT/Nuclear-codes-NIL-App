export async function fetchTestMessage() {
  const res = await fetch('/api/test');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}