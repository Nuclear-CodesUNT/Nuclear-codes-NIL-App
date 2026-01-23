"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"}/api/auth/login`,
        {
          method: "POST",
            headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data); // update context
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* left column */}
      <div className="flex justify-center pt-20 p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Welcome Back to NIL App!</h1>
          <p className="text-gray-600 mb-8">
            Sign in to access your dashboard, educational resources, and profile.
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-field"
                placeholder="Enter your email"
                required
              />
            </div>
           <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-field"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <Link href="/forgot-password" className="block text-sm text-right text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div>
            <p className="pt-6 flex justify-center text-black">
              Don't have an account?
              <Link href="/signup" className="ml-1 text-cyan-300 hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* right column - hero section */}
      <div className="bg-brand-navy flex items-start justify-center p-12 pt-50">
        <div className="w-full max-w-lg">
          <h1 className="text-white text-5xl font-bold leading-tight mb-8">
            Your NIL Solution,<br/> All in One Platform.
          </h1>
          <p className="text-gray-300 text-lg italic mb-6">
            "My favorite platform man, they really got me right. I made the most out of my contract, learned how to best manage my resources, and got into contact with companies like Nike!"
          </p>
          <div className="flex items-center gap-3">
            <img
              src="/images/lebron.svg"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold">LeBron James</p>
              <p className="text-gray-400 text-sm">Greatest basketball player of all time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}