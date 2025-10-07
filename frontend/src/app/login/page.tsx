export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* left column */}
      <div className="flex justify-center p-2">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-field"
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
                className="form-field"
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
      </div>
      
      {/* right column - testimonial stuff */}
      <div className="bg-[#2B2D42] flex items-center justify-center p-2">
        {/* Add your testimonial content here */}
      </div>
    </div>
  );
}