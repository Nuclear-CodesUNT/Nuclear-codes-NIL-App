"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function App() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  
  // Form data state - handles all form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    currentYear: '',
    sport: '',
    position: '',
    role: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes for all form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  // Handle role selection (Player, Coach, Mentor)
  const handleRoleSelect = (buttonId: number, roleName: string) => {
    setSelected(buttonId);
    setFormData({
      ...formData,
      role: roleName
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation - ensure required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields and select a role');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // API call to backend signup endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000'}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          school: formData.school,
          currentYear: formData.currentYear,
          sport: formData.sport,
          position: formData.position
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //Profile button info
  const buttons = [
    { id: 1, icon: "PlayerIcon" , name: "Player", description: "Showcase your skills and connect with coaches" },
    { id: 2, icon: "CoachIcon" , name: "Coach", description: "Discover talent and build your team" },
    { id: 3, icon: "LawyerIcon", name: "Lawyer", description: "Guide athletes in their career development" },
  ];

 return (
  <form onSubmit={handleSubmit} className="min-h-screen">
      {/* Header Section*/}
      <div className="text-center mt-8 mb-6 px-4">
        <h2 className="text-3xl font-bold text-black mb-2">Create Your Account</h2>
        <p className="text-gray-600 text-lg">
          Join our community of athletes, coaches, and mentors
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-5xl w-full mx-4">
            {error}
          </div>
        </div>
      )}
      
      {/* Profile type Frame */}
      <div className="flex justify-center items-center p-4">
        <div
          className={`
            flex flex-col                    
            w-full max-w-5xl                 
            bg-white rounded-3xl shadow-md   
            border border-gray-300           
            pt-4 px-8 pb-8                   
          `}
        >
          {/* Choose Title */}
          <h2 className="text-xl font-bold text-black mb-4">Choose Your Role</h2>

          {/* Buttons */}
          <div
            className={`
              flex flex-col md:flex-row   
              w-full gap-4               
            `}
          >
            {buttons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => handleRoleSelect(btn.id, btn.name)}
                className={`
                  flex flex-col items-center justify-center   
                  p-6 rounded-2xl transition border-2 flex-1  
                  ${
                    selected === btn.id
                      ? "border-black"
                      : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-4xl mb-2">{btn.icon}</div>
                <span className="font-bold text-black text-lg">{btn.name}</span>
                <span className="text-sm text-gray-500 text-center mt-1">
                  {btn.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

 {/* Profile Information Frame */}
      <div className="flex justify-center items-center p-4 mt-6">
        <div
          className={`
            flex flex-col                     
            w-full max-w-5xl                  
            bg-white rounded-3xl             
            shadow-md border border-gray-300  
            p-8 space-y-6                     
          `}
        >
          {/* Name and Email Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* First name */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                required
              />
            </div>
            {/* Last name */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                required
              />
            </div>
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-black">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
              required
            />
          </div>

          {/* Password Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* School */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-black">School/University</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="Enter your school or university"
              className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
            />
          </div>

          {/* Current Year Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">Current Year</label> 
              <select
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md text-black"
              >
                <option value="">Select year</option>
                <option>Freshman</option>
                <option>Sophomore</option>
                <option>Junior</option>
                <option>Senior</option>
                <option>Graduate</option>
              </select>
            </div>
            {/* Current Sport Selection */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">Sport</label>
              <select
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md text-black"
              >
                <option value="">Select sport</option>
                <option>Basketball</option>
                <option>Football</option>
                <option>Baseball</option>
              </select>
            </div>
          </div>

          {/* Position */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-black">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter your position"
              className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 btn-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}


