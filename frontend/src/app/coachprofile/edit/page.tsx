'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import Link from "next/link";
import api from '@/lib/api';

// Coach interface for frontend
interface CoachInformation {
  school: string;
  sport: string;
  role?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  achievements?: string[];
  bio?: string;
  profilePicture?: string;
  specializations?: string[];
}

export default function EditCoachProfile() {
  const [school, setSchool] = useState("");
  const [sport, setSport] = useState("");
  const [role, setRole] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | "">("");
  const [certificationsInput, setCertificationsInput] = useState("");
  const [achievementsInput, setAchievementsInput] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("/images/ProfilepicPlaceholder.png");
  const [specializationsInput, setSpecializationsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/profile');

        const p = data.profile;

        setSchool(p?.school || "");
        setSport(p?.sport || "");
        setRole(p?.role || "");
        setYearsOfExperience(p?.yearsOfExperience || "");
        setCertificationsInput((p?.certifications || []).join(", "));
        setAchievementsInput((p?.achievements || []).join(", "));
        setBio(p?.bio || "");
        setProfilePicture(p?.profilePicture || "/images/ProfilepicPlaceholder.png");
        setSpecializationsInput((p?.specializations || []).join(", "));

        setLoading(false);
      } catch (err: any) {
        console.error("Network error loading profile", err);
        setError(err.response?.data?.error || "Network error loading profile");
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Save handler
  const handleSave = async () => {
    try {
      const specializationsArray = specializationsInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const certificationsArray = certificationsInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const achievementsArray = achievementsInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      await api.put('/profile', {
        school,
        sport,
        role,
        yearsOfExperience,
        certifications: certificationsArray,
        achievements: achievementsArray,
        bio,
        profilePicture,
        specializations: specializationsArray,
      });

      alert("Profile updated successfully");
      router.push("/coachprofile");
    } catch (err: any) {
      alert(err.response?.data?.error || "Network error saving profile");
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
      <div className="flex flex-col gap-6 pr-4">
        <div className="relative flex flex-col z-0 sm:flex-row items-center sm:items-start bg-white border border-gray-300 rounded-lg p-8 pb-6 gap-6">
          <h2 className="absolute -top-4 left-4 bg-white px-2 text-lg font-semibold">Basic Information</h2>

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={profilePicture}
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border border-gray-200"
            />
            <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:underline">
              <Upload className="w-4 h-4" />
              <span>Change photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Coach Info */}
          <div className="flex flex-col gap-4 w-full">
            <div>
              <label className="text-sm font-medium text-gray-700">School</label>
              <input type="text" value={school} onChange={(e) => setSchool(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Sport</label>
              <input type="text" value={sport} onChange={(e) => setSport(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Years of Experience</label>
              <input type="number" value={yearsOfExperience || ""} onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2 mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Specializations (comma separated)</label>
              <input type="text" value={specializationsInput} onChange={(e) => setSpecializationsInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1" placeholder="e.g., Offensive, Defensive" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Certifications (comma separated)</label>
              <input type="text" value={certificationsInput} onChange={(e) => setCertificationsInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1" placeholder="e.g., CPR, First Aid" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Achievements (comma separated)</label>
              <input type="text" value={achievementsInput} onChange={(e) => setAchievementsInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1" placeholder="e.g., State Champion 2023" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
                className="w-full border border-gray-300 rounded-md p-2 mt-1" />
            </div>
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="flex justify-end gap-3 mt-6 pb-12">
          <Link href="/coachprofile" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Cancel
          </Link>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}