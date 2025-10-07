export default function Login() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form className="max-w-md space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}