export default async function Home() {
  const data = await getTestMessage();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Home</h2>
      <p className="mb-4">Welcome to the NIL App home page.</p>
      {data?.message && <p className="text-green-600">Backend says: {data.message}</p>}
    </div>
  );
}

async function getTestMessage() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/test`, {
      cache: 'no-store' 
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error('Failed to fetch:', error);
    return null;
  }
}

