'use client';

import { useState } from 'react';
import { DayPicker } from "react-day-picker";
import { Share2, UserPlus, MessageSquare, Trophy, MapPin, CalendarDays, Eye, ThumbsUp, MessageCircle } from "lucide-react";

interface AthleteInformation {
  playerName: string;
  sport?: string;
  position?: string;
  teamName?: string;
  location?: string;
  bio?: string;
  profilepicture?: string;
  stats?: Map<string, string>;
}

export default function AthleteProfile({
  playerName,
  profilepicture,
  sport,
  position,
  teamName,
  location,
  bio,
  stats
}: AthleteInformation) {

  const placeholderHighlights = [
    { id: 1, image: "/images/court.png", views: "2.3k", likes: "120", comments: "15", date: "Oct 10, 2025" },
    { id: 2, image: "/images/court.png", views: "1.1k", likes: "98", comments: "8", date: "Oct 8, 2025" },
    { id: 3, image: "/images/court.png", views: "3.4k", likes: "200", comments: "30", date: "Oct 5, 2025" },
    { id: 4, image: "/images/court.png", views: "2.3k", likes: "120", comments: "15", date: "Oct 10, 2025" },
    { id: 5, image: "/images/court.png", views: "1.1k", likes: "98", comments: "8", date: "Oct 8, 2025" },
    { id: 6, image: "/images/court.png", views: "3.4k", likes: "200", comments: "30", date: "Oct 5, 2025" },
  ];

  return (
    <>
      {/* Main container*/}
      <div className="grid grid-cols-[1fr_auto] gap-6 pt-12 px-6 md:px-12 max-w-full">

        {/* Left Column Player Profile/Highlights */}
        <div className="flex flex-col gap-6 pr-4">

          {/* Player Profile Frame */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start bg-white border border-gray-300 rounded-lg p-8 pb-1 gap-6">
            {/* Profile picture */}
            <div className="flex-shrink-0">
              <img
                src={profilepicture || "/images/ProfilepicPlaceholder.png"}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border border-gray-200"
              />
            </div>

            {/* Player Info */}
            <div className="flex flex-col gap-4 w-full">
              <div className="text-lg">Player name {playerName}</div>

              {/* Sport/Position */}
              <div className="flex flex-row gap-2 flex-wrap">
                <div className="border border-gray-300 bg-gray-300 rounded-lg px-2 text-center text-sm self-start w-auto">
                  Basketball {sport}
                </div>
                <div className="border border-gray-400 rounded-lg px-2 text-center text-sm self-start w-auto">
                  Point Guard {position}
                </div>
              </div>

              {/* Team Name */}
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-600" />
                <span>Team:</span> {teamName}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span>Location:</span> {location}
              </div>

              {/* Bio */}
              <div>
                Professional basketball player with 5 years of experience in competitive leagues.
                Known for exceptional court vision and three-point shooting.
                Committed to excellence on and off the court. Looking to connect with fans and share my journey. {bio}
              </div>

              {/* Stats Section */}
              <div className="mt-6">
                <div className="grid grid-cols-3 gap-4">
                  {(stats && stats.size > 0 ? [...stats.entries()] : [
                    ["PPG", "25.3"],
                    ["APG", "7.4"],
                    ["RPG", "10.2"],
                  ]).map(([name, value]) => (
                    <div
                      key={name}
                      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                      <span className="text-gray-900">{value}</span>
                      <span className="text-sm font-bold">{name}</span>
                    </div>
                  ))}
                </div>

                {/* Profile Buttons */}
                <div className="flex justify-end gap-3 py-5">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded">
                    <UserPlus className="w-5 h-5" /> Follow
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded">
                    <MessageSquare className="w-5 h-5" /> Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Highlights Section */}
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Highlights</h2>
              <span className="text-sm text-gray-500">{placeholderHighlights.length} Videos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {placeholderHighlights.map((highlight) => (
              <div
                key={highlight.id}
                className="overflow-hidden rounded-lg border border-gray-200 shadow flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-40 sm:h-48 overflow-hidden">
                  <img
                    src={highlight.image}
                    alt={`Highlight ${highlight.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Hightlight info  */}
                <div className="p-3 flex flex-col gap-1">
                  {/* Highlight title */}
                  <h3 className="text-sm font-semibold text-gray-800">Highlight {highlight.id}</h3>

                  {/* Highlight stats */}
                  <div className="flex gap-4 text-xs text-gray-700">
                    <div className="flex items-center gap-1"><Eye className="w-4 h-4" />{highlight.views}</div>
                    <div className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{highlight.likes}</div>
                    <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{highlight.comments}</div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-500">{highlight.date}</div>
                </div>
              </div>
            ))}

            </div>
          </div>

        </div> {/* End Left Column */}

        {/* Right Column Game Schedule Sidebar */}
        <div className="w-120 p-6 py-4 top-25 sticky border rounded-lg border-gray-200 self-start">
          <div className="flex gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-gray-700" />
            <h2>Game Schedule</h2>
          </div>

          <div className="mb-6">
            <div className="w-full bg-white border border-gray-200 rounded shadow p-3">
              <div className="flex justify-center">
                <DayPicker
                  navLayout="around"
                  showOutsideDays
                  className="w-full max-w-[350px]"
                  styles={{
                    head_cell: { padding: '0.5rem' },
                    day: { padding: '0.75rem' },
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <ul className="space-y-4">
            {[
              { title: "vs Hawks", type: "Home", location: "Stadium A", date: "Oct 20" },
              { title: "vs Lions", type: "Away", location: "Arena B", date: "Oct 22" },
              { title: "vs Bears", type: "Home", location: "Field C", date: "Oct 25" },
            ].map((game, idx) => (
              <li
                key={idx}
                className="p-4 bg-gray-200 rounded-lg grid grid-cols-[1fr_auto] gap-2 items-center"
              >
                {/* Left column*/}
                <div className="flex flex-col gap-1 px-1">
                  {/* Row 1 title/type */}
                  <span className="text-lg">{game.title} 
                  <span className="text-sm text-gray-500 font-normal border px-2 py-1 rounded-lg ml-3">{game.type}</span>
                  </span>
                  {/* Row 2 location */}
                  <span className="text-sm text-gray-600">{game.location}</span>
                </div>

                {/* Right column date */}
                <span className="text-xs text-gray-500 text-right">{game.date}</span>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </>
  );
}
