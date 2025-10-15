export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* left column */}
      <div className="flex justify-center pt-20 p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">Welcome Back to NIL App!</h1>
          <p className="text-gray-600 mb-8">
            Sign in to access your dashboard, educational resources, and profile.
          </p>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium mb-2">
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
            <div>
              <label htmlFor="forgotpass" className="block text-sm text-right">
                Forgot password?
              </label>
            </div>
            <button
              type="submit"
              className="btn-primary"
            >
              Sign In
            </button>
          </form>
          <div>
            <p className="pt-6 flex justify-center text-black">
              Don't have an account?
              <a href="/signup" className="ml-1 text-cyan-300">Sign up</a>
            </p>
          </div>
        </div>
      </div>
      
      {/* right column - hero section */}
      <div className="bg-[#2B2D42] flex items-start justify-center p-12 pt-50">
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