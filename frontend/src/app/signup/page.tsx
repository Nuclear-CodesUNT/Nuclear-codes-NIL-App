"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function App() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  
  // Form data state - handles all form inputs
  const [formData, setFormData] = useState({
    // Basic info (Step 1)
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    
    // Athlete fields (Step 2)
    school: '',
    currentYear: '',
    sport: '',
    position: '',
    
    // Lawyer fields (Step 2)
    barNumber: '',
    state: '',
    firmName: '',
    specializations: [] as string[],
    yearsOfExperience: '',
    
    // Coach fields (Step 2) - using different names to avoid conflicts
    coachSchool: '',
    coachSport: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes for all form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'specializations') {
      // Handle comma-separated specializations
      setFormData({
        ...formData,
        specializations: value.split(',').map(s => s.trim()).filter(s => s)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  // Handle role selection
  const handleRoleSelect = (buttonId: number, roleName: string) => {
    setSelected(buttonId);
    setFormData({
      ...formData,
      role: roleName.toLowerCase() === 'player' ? 'athlete' : roleName.toLowerCase()
    });
  };

  // Validate Step 1
  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields and select a role');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  // Validate Step 2 based on role
  const validateStep2 = () => {
    switch (formData.role) {
      case 'athlete':
        if (!formData.school || !formData.currentYear) {
          setError('School and current year are required for athletes');
          return false;
        }
        break;
      case 'lawyer':
        if (!formData.barNumber || !formData.state || !formData.yearsOfExperience) {
          setError('Bar number, state, and years of experience are required for lawyers');
          return false;
        }
        break;
      case 'coach':
        if (!formData.coachSchool || !formData.coachSport) {
          setError('School and sport are required for coaches');
          return false;
        }
        break;
    }
    return true;
  };

  // Handle next step
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setStep(1);
    setError('');
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare role-specific data
      let roleSpecificData = {};
      
      switch (formData.role) {
        case 'athlete':
          roleSpecificData = {
            school: formData.school,
            currentYear: formData.currentYear,
            sport: formData.sport || undefined,
            position: formData.position || undefined
          };
          break;
        case 'lawyer':
          roleSpecificData = {
            barNumber: formData.barNumber,
            state: formData.state,
            firmName: formData.firmName || undefined,
            specializations: formData.specializations,
            yearsOfExperience: parseInt(formData.yearsOfExperience)
          };
          break;
        case 'coach':
          roleSpecificData = {
            school: formData.coachSchool,
            sport: formData.coachSport
          };
          break;
      }

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
          ...roleSpecificData
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

  // Profile button info
  const buttons = [
    { id: 1, icon: "🏀", name: "Player", description: "Showcase your skills and connect with coaches" },
    { id: 2, icon: "👨‍🏫", name: "Coach", description: "Discover talent and build your team" },
    { id: 3, icon: "⚖️", name: "Lawyer", description: "Guide athletes in their career development" },
  ];

  // Render Step 1
  const renderStep1 = () => (
    <>
      {/* Profile type Frame */}
      <div className="flex justify-center items-center p-4">
        <div className="flex flex-col w-full max-w-5xl bg-white rounded-3xl shadow-md border border-gray-300 pt-4 px-8 pb-8">
          <h2 className="text-xl font-bold text-black mb-4">Choose Your Role</h2>
          <div className="flex flex-col md:flex-row w-full gap-4">
            {buttons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => handleRoleSelect(btn.id, btn.name)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl transition border-2 flex-1 ${
                  selected === btn.id ? "border-black" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-4xl mb-2">{btn.icon}</div>
                <span className="font-bold text-black text-lg">{btn.name}</span>
                <span className="text-sm text-gray-500 text-center mt-1">{btn.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Basic Information Frame */}
      <div className="flex justify-center items-center p-4 mt-6">
        <div className="flex flex-col w-full max-w-5xl bg-white rounded-3xl shadow-md border border-gray-300 p-8 space-y-6">
          <h2 className="text-xl font-bold text-black mb-4">Basic Information</h2>
          
          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-4">
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

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Render Step 2 - Role-specific fields
  const renderStep2 = () => (
    <div className="flex justify-center items-center p-4">
      <div className="flex flex-col w-full max-w-5xl bg-white rounded-3xl shadow-md border border-gray-300 p-8 space-y-6">
        <h2 className="text-xl font-bold text-black mb-4">
          {formData.role === 'athlete' && 'Player Information'}
          {formData.role === 'lawyer' && 'Lawyer Information'}
          {formData.role === 'coach' && 'Coach Information'}
        </h2>

        {/* Athlete Fields */}
        {formData.role === 'athlete' && (
          <>
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">School/University *</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="Enter your school or university"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-black">Current Year *</label>
                <select
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md text-black"
                  required
                >
                  <option value="">Select year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-black">Sport</label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md text-black"
                >
                  <option value="">Select sport</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Football">Football</option>
                  <option value="Baseball">Baseball</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Tennis">Tennis</option>
                </select>
              </div>
            </div>

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
          </>
        )}

        {/* Lawyer Fields */}
        {formData.role === 'lawyer' && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-black">Bar Number *</label>
                <input
                  type="text"
                  name="barNumber"
                  value={formData.barNumber}
                  onChange={handleChange}
                  placeholder="Enter your bar number"
                  className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-black">Licensed State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter licensed state"
                  className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">Law Firm</label>
              <input
                type="text"
                name="firmName"
                value={formData.firmName}
                onChange={handleChange}
                placeholder="Enter your law firm name (optional)"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-black">Specializations</label>
                <input
                  type="text"
                  name="specializations"
                  value={formData.specializations.join(', ')}
                  onChange={handleChange}
                  placeholder="e.g., Sports Law, Contract Law (comma-separated)"
                  className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-black">Years of Experience *</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                  min="0"
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Coach Fields */}
        {formData.role === 'coach' && (
          <>
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">School/University *</label>
              <input
                type="text"
                name="coachSchool"
                value={formData.coachSchool}
                onChange={handleChange}
                placeholder="Enter your school or university"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">Sport *</label>
              <select
                name="coachSport"
                value={formData.coachSport}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded-md text-black"
                required
              >
                <option value="">Select sport</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">Football</option>
                <option value="Baseball">Baseball</option>
                <option value="Soccer">Soccer</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>
          </>
        )}

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={handlePrevious}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="min-h-screen">
      {/* Header Section */}
      <div className="text-center mt-8 mb-6 px-4">
        <h2 className="text-3xl font-bold text-black mb-2">Create Your Account</h2>
        <p className="text-gray-600 text-lg">
          Join our community of athletes, coaches, and lawyers
        </p>
        
        {/* Step Indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-5xl w-full mx-4">
            {error}
          </div>
        </div>
      )}
      
      {/* Render current step */}
      {step === 1 ? renderStep1() : renderStep2()}
    </form>
  );
}


