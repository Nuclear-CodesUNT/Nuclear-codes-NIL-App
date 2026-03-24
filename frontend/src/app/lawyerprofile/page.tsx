'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MessageSquare, MapPin } from "lucide-react";
import MessagesOverview from '../../components/dashboard-messages';
import api from '@/lib/api';

// Frontend interface for lawyer profile
interface LawyerInformation {
  userId: string;
  userName: string;
  barNumber: string;
  state: string;
  firmName?: string;
  specializations: string[];
  yearsOfExperience: number;
  profilepicture?: string;
  bio?: string;
}

export default function LawyerProfile() {
  const [profile, setProfile] = useState<LawyerInformation | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/profile');

        setProfile({
          userId: data.profile.userId,
          userName: data.user.name,
          barNumber: data.profile.barNumber,
          state: data.profile.state,
          firmName: data.profile.firmName,
          specializations: data.profile.specializations || [],
          yearsOfExperience: data.profile.yearsOfExperience,
          profilepicture: data.profile?.profilepicture,
          bio: data.profile?.bio,
        });

        setLoggedInUserId(data.user._id);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || "Network error");
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 text-lg">{error}</div>;
  }

  return (
    <>
      {/* Main container */}
      <div
      className="min-h-screen bg-contain bg-center bg-no-repeat grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 pt-12 px-6 md:px-12 max-w-full"
      style={{ backgroundImage: "url('/images/NILLAWEdited.png')" }}
    >

        {/* Left Column Profile */}
        <div className="flex flex-col gap-6 pr-4">

          {/* Profile Frame */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start bg-white/70 border border-gray-300 rounded-lg p-8 pb-10 gap-6">
            
            {/* Profile picture */}
            <div className="shrink-0">
              <img
                src={profile?.profilepicture || "/images/ProfilepicPlaceholder.png"}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border border-gray-200"
              />
            </div>

            {/* Lawyer Info Card */}
            <div className="relative flex flex-col gap-4 w-full p-6 bg-white/0 border border-gray-200 rounded-lg">

              {/* Edit Profile button (top-right corner of info card) */}
              {loggedInUserId === profile?.userId && (
                <Link
                  href="/lawyerprofile/edit"
                  className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 hover:bg-gray-300 text-sm border border-gray-300 rounded-md"
                >
                  Edit Profile
                </Link>
              )}

              {/* Lawyer Name */}
              <div className="text-xl font-semibold">{profile?.userName || "Lawyer Name"}</div>

              {/* Bar Number */}
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Bar Number:</span> {profile?.barNumber || "N/A"}
              </div>

              {/* State */}
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">State:</span> {profile?.state || "N/A"}
              </div>

              {/* Firm Name */}
              {profile?.firmName && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium">Firm:</span> {profile.firmName}
                </div>
              )}

              {/* Specializations */}
              {profile?.specializations && profile.specializations.length > 0 && (
                <div className="flex flex-col text-gray-700">
                  <span className="font-medium">Specializations:</span>
                  <ul className="list-disc list-inside ml-2">
                    {profile.specializations.map((spec: string, idx: number) => (
                      <li key={idx}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Years of Experience */}
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Years of Experience:</span> {profile?.yearsOfExperience ?? "N/A"}
              </div>

              {/* Bio at the bottom */}
              {profile?.bio && (
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
        </div> {/* End Left Column */}

        {/* Messages Frame only displayed if viewing your own profile */}
        {profile?.userId === loggedInUserId && (
          <div className="hidden lg:block">
          <div className="bg-white border border-gray-300 rounded-lg p-6 h-fit sticky top-24">
              <MessagesOverview />
            </div>
          </div>
          )}
      </div>
    </>
  );
}