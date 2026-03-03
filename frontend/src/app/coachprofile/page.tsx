'use client';

import Link from 'next/link';
import MessagesOverview from '../../components/dashboard-messages';
import { useEffect, useState } from 'react';
import { MessageSquare } from "lucide-react";

// Frontend interface for coach profile
interface CoachInformation {
  userId: string;
  userName: string;
  school: string;
  sport: string;
  role?: string;
  yearsOfExperience?: number;
  certifications?: string[];
  achievements?: string[];
  specializations?: string[];
  profilePicture?: string;
  bio?: string;
}

export default function CoachProfile() {
  const [profile, setProfile] = useState<CoachInformation | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/profile", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load profile");
          setLoading(false);
          return;
        }

        const p = data.profile;

        setProfile({
          userId: p?.userId || "",
          userName: data.user?.name || "",
          school: p?.school || "",
          sport: p?.sport || "",
          role: p?.role,
          yearsOfExperience: p?.yearsOfExperience,
          certifications: p?.certifications || [],
          achievements: p?.achievements || [],
          specializations: p?.specializations || [],
          profilePicture: p?.profilePicture || "/images/ProfilepicPlaceholder.png",
          bio: p?.bio || "",
        });

        setLoggedInUserId(data.user?._id || null);
        setLoading(false);
      } catch (err) {
        setError("Network error");
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-600 text-lg">{error}</div>;
  if (!profile) return null;

  return (
    <div
      className="min-h-screen bg-contain bg-center bg-no-repeat grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 pt-12 px-6 md:px-12 max-w-full"
      style={{ backgroundImage: "url('/images/NILLAWEdited.png')" }}
    >
      <div className="flex flex-col gap-6 pr-4">

        {/* Profile Frame */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start bg-white/70 border border-gray-300 rounded-lg p-8 pb-10 gap-6">
          
          {/* Profile picture */}
          <div className="flex-shrink-0">
            <img
              src={profile.profilePicture}
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border border-gray-200"
            />
          </div>

          {/* Coach Info Card */}
          <div className="relative flex flex-col gap-4 w-full p-6 bg-white/0 border border-gray-200 rounded-lg">

            {/* Edit Profile button */}
            {loggedInUserId === profile.userId && (
              <Link
                href="/coachprofile/edit"
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 hover:bg-gray-300 text-sm border border-gray-300 rounded-md"
              >
                Edit Profile
              </Link>
            )}

            {/* Name */}
            <div className="text-xl font-semibold">{profile.userName}</div>

            {/* School */}
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">School:</span> {profile.school}
            </div>

            {/* Sport */}
            <div className="flex items-center gap-2 text-gray-700">
              <span className="font-medium">Sport:</span> {profile.sport}
            </div>

            {/* Role */}
            {profile.role && (
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Role:</span> {profile.role}
              </div>
            )}

            {/* Years of Experience */}
            {profile.yearsOfExperience !== undefined && (
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Years of Experience:</span> {profile.yearsOfExperience}
              </div>
            )}

            {/* Specializations */}
            {profile.specializations && profile.specializations.length > 0 && (
              <div className="flex flex-col text-gray-700">
                <span className="font-medium">Specializations:</span>
                <ul className="list-disc list-inside ml-2">
                  {profile.specializations.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="flex flex-col text-gray-700">
                <span className="font-medium">Certifications:</span>
                <ul className="list-disc list-inside ml-2">
                  {profile.certifications.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {profile.achievements && profile.achievements.length > 0 && (
              <div className="flex flex-col text-gray-700">
                <span className="font-medium">Achievements:</span>
                <ul className="list-disc list-inside ml-2">
                  {profile.achievements.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <div className="mt-4 text-gray-700 border-t border-gray-200 pt-3">
                <span className="font-medium">Bio:</span>
                <p className="mt-1">{profile.bio}</p>
              </div>
            )}

            {/* Message Button */}
            <div className="flex justify-end gap-3 py-1">
              <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded">
                <MessageSquare className="w-5 h-5" /> Message
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Messages Frame only displayed if viewing your own profile */}
      {profile?.userId === loggedInUserId && (
        <div className="hidden lg:block">
          <div className="bg-white border border-gray-300 rounded-lg p-6 h-fit sticky top-24">
            <MessagesOverview />
          </div>
        </div>
      )}
    </div>
  );
}