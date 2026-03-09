'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Trophy, MapPin, CalendarDays, Upload, Trash2, Plus, Minus } from "lucide-react";
import "react-day-picker/style.css";
import Link from "next/link";


// Lawyer interface for frontend
interface LawyerInformation {
  userName: string;
  barNumber: string;
  state: string;
  firmName?: string;
  specializations: string[];
  yearsOfExperience: number;
  bio?: string;
  profilepicture?: string;
}

export default function EditLawyerProfile({
  userName: initialUserName = "Lawyer Name",
  barNumber: initialBarNumber = "",
  state: initialState = "",
  firmName: initialFirmName = "",
  specializations: initialSpecializations = [],
  yearsOfExperience: initialYearsOfExperience = 0,
  bio: initialBio = "",
  profilepicture: initialProfilePicture = "/images/ProfilepicPlaceholder.png",
}: LawyerInformation) {
  const [userName, setUserName] = useState(initialUserName);
  const [barNumber, setBarNumber] = useState(initialBarNumber);
  const [state, setState] = useState(initialState);
  const [firmName, setFirmName] = useState(initialFirmName);
  const [specializations, setSpecializations] = useState(initialSpecializations);
  const [yearsOfExperience, setYearsOfExperience] = useState(initialYearsOfExperience);
  const [bio, setBio] = useState(initialBio);
  const [profilepicture, setProfilePicture] = useState(initialProfilePicture);
  const [specializationsInput, setSpecializationsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/profile", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load profile");
          setLoading(false);
          return;
        }

        const p = data.profile;

        setUserName(data.user.name || "");
        setBarNumber(p?.barNumber || "");
        setState(p?.state || "");
        setFirmName(p?.firmName || "");
        setSpecializationsInput(p?.specializations?.join(", ") || "");
        setYearsOfExperience(p?.yearsOfExperience || 0);
        setBio(p?.bio || "");
        setProfilePicture(p?.profilepicture || "/images/ProfilepicPlaceholder.png");

        setLoading(false);
      } catch (err) {
        console.error("Network error loading profile", err);
        setError("Network error loading profile");
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Save handler
  const handleSave = async () => {
    try {
      const specsArray = specializationsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean); // remove empty strings

      const res = await fetch("http://localhost:4000/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          barNumber,
          state,
          firmName,
          specializations: specsArray,
          yearsOfExperience,
          bio,
          profilepicture
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update profile");
        return;
      }

      alert("Profile updated successfully");
      router.push("/lawyerprofile");
    } catch (err) {
      alert("Network error saving profile");
    }
  };

  // Profile picture upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-600 text-lg">{error}</div>;

  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 pt-12 px-6 md:px-12 max-w-full">

      {/* Left Column - Editable Profile */}
      <div className="flex flex-col gap-6 pr-4">

        {/* Profile Frame */}
        <div className="relative flex flex-col z-0 sm:flex-row items-center sm:items-start bg-white border border-gray-300 rounded-lg p-8 pb-6 gap-6">
          
          {/* Section Title */}
          <h2 className="absolute -top-4 left-4 bg-white px-2 text-lg font-semibold">Basic Information</h2>

          {/* Profile picture */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={profilepicture}
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border border-gray-200"
            />
            <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:underline">
              <Upload className="w-4 h-4" />
              <span>Change photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Lawyer Info */}
          <div className="flex flex-col gap-4 w-full">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Bar Number</label>
              <input
                type="text"
                value={barNumber}
                onChange={(e) => setBarNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Firm Name</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">
                Specializations (comma separated)
              </label>
              <input
                type="text"
                value={specializationsInput}
                onChange={(e) => setSpecializationsInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="e.g., Corporate Law, Tax Law, Family Law"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            </div>

          </div>

        </div>

        {/* Save / Cancel */}
        <div className="flex justify-end gap-3 mt-6 pb-12">
          <Link
            href="/lawyerprofile"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}