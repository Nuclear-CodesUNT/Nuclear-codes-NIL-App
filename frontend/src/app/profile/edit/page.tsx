'use client';

import { useState } from 'react';
import { DayPicker } from "react-day-picker";
import { Trophy, MapPin, CalendarDays, Upload, Trash2, Plus, Minus } from "lucide-react";
import "react-day-picker/style.css";
import Link from "next/link";

interface AthleteInformation {
  playerName: string;
  sport?: string;
  position?: string;
  teamName?: string;
  location?: string;
  bio?: string;
  profilepicture?: string;
}

interface Highlight {
  id: number;
  title: string;
  image: string;
}

export default function EditAthleteProfile({
  playerName: initialPlayerName = "John Doe",
  sport: initialSport = "Basketball",
  position: initialPosition = "Point Guard",
  teamName: initialTeamName = "Lakers",
  location: initialLocation = "Los Angeles",
  bio: initialBio = "Professional basketball player with 5 years of experience in competitive leagues.",
  profilepicture: initialProfilePicture = "/images/ProfilepicPlaceholder.png",
}: AthleteInformation) {

  // Editable states
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [sport, setSport] = useState(initialSport);
  const [position, setPosition] = useState(initialPosition);
  const [teamName, setTeamName] = useState(initialTeamName);
  const [location, setLocation] = useState(initialLocation);
  const [bio, setBio] = useState(initialBio);
  const [profilepicture, setProfilePicture] = useState(initialProfilePicture);
  const [gameDays, setGameDays] = useState<{ date: Date; homeAway: "Home" | "Away"; opponent: string }[]>([]);




  // Highlights
  const [highlights, setHighlights] = useState<Highlight[]>([
    { id: 1, title: "Highlight 1", image: "/images/court.png" },
    { id: 2, title: "Highlight 2", image: "/images/court.png" },
  ]);

  // Stats
  const [stats, setStats] = useState<{ name: string; value: string }[]>([
    { name: "PPG", value: "25.3" },
    { name: "APG", value: "7.4" },
    { name: "RPG", value: "10.2" },
  ]);

  // Save handler
  const handleSave = () => {
    console.log("Saving profile:", {
      playerName,
      sport,
      position,
      teamName,
      location,
      bio,
      profilepicture,
      highlights,
      stats,
    });
    alert("Profile saved successfully!");
  };

  // Profile picture upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Highlight upload
  const handleHighlightUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setHighlights(prev => [
          ...prev,
          { id: Date.now(), title: file.name, image: reader.result as string }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete highlight
  const handleDeleteHighlight = (id: number) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  // Add stat
  const handleAddStat = () => {
    setStats(prev => [...prev, { name: "", value: "" }]);
  };

  // Update stat
  const handleStatChange = (index: number, key: 'name' | 'value', value: string) => {
    setStats(prev => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  // Remove stat
  const handleRemoveStat = (index: number) => {
    setStats(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 pt-12 px-6 md:px-12 max-w-full">

        {/* Left Column - Editable Profile */}
        <div className="flex flex-col gap-6 pr-4">

          {/* Profile Frame */}
          <div className="relative flex flex-col z-0 sm:flex-row items-center sm:items-start bg-white border border-gray-300 rounded-lg p-8 pb-6 gap-6">
            
            {/* New Section Title */}
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

            {/* Player Info */}
            <div className="flex flex-col gap-4 w-full">
              <div>
                <label className="text-sm font-medium text-gray-700">Player Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div className="flex flex-row gap-4 flex-wrap">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Sport</label>
                  <input
                    type="text"
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gray-600" /> Team
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" /> Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Stats Management */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl ">Season Statistics</h2>
              <button
                onClick={handleAddStat}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                <Plus className="w-4 h-4" /> Add Stat
              </button>
            </div>

            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={stat.name}
                    onChange={(e) => handleStatChange(index, 'name', e.target.value)}
                    placeholder="Name (e.g. PPG)"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g. 25.3)"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                  />
                  <button
                    onClick={() => handleRemoveStat(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Upload Section */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl mb-4">Video Highlights</h2>

            {/* Drag & Drop Upload Box */}
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col justify-center items-center gap-3 text-center">
              <Upload className="w-10 h-10 text-gray-500" />
              <p className="text-gray-600 font-medium">Drag and drop your video files here, or</p>
              
              <label className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800">
                <Plus className="w-5 h-5" /> Choose files
                <input type="file" accept="video/mp4,video/mov,video/avi" onChange={handleHighlightUpload} className="hidden" />
              </label>

              <p className="text-xs text-gray-500 mt-1">Supports: MP4, MOV, AVI (Max 500MB per file)</p>
            </div>

            {/* Uploaded Highlights Grid */}
            <h3 className="text-lg font-medium mt-6 mb-2">Uploaded Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="relative border rounded-lg overflow-hidden flex flex-col"
              >
                <img src={highlight.image} className="w-full h-40 object-cover" />

                <div className="p-3 flex flex-col">
                  {/* Title with Gray Background */}
                  <div className="bg-gray-200 rounded-md px-2 py-1 text-sm font-medium text-gray-800 truncate">
                    {highlight.title}
                  </div>

                  {/* Upload Date + Delete Button Row */}
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(highlight.id).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDeleteHighlight(highlight.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex justify-end gap-3 mt-6 pb-12">
            <Link
              href="/profile"
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

        {/* Right Column - Calendar */}
        <div className="w-full sm:w-[300px] md:w-[400px] lg:w-[450px] xl:w-[500px] p-6 py-4 sticky top-24  border rounded-lg border-gray-200 self-start bg-white">
          <div className="flex gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg">Game Schedule</h2>
          </div>

          {/* Calendar + Game Days */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded p-1">
            <div className="flex justify-center">
              <DayPicker
                mode="multiple"
                required={false}
                selected={gameDays.map((g) => g.date)}
                onSelect={(dates) => {
                  if (!dates) return;

                  const updated = [...gameDays];

                  dates.forEach((d) => {
                    const exists = updated.some((g) => g.date.getTime() === d.getTime());
                    if (!exists) {
                      updated.push({
                        date: d,
                        homeAway: "Home",
                        opponent: "",
                      });
                    }
                  });

                  // remove deselected dates
                  updated.forEach((g, i) => {
                    if (!dates.find((d) => d.getTime() === g.date.getTime())) {
                      updated.splice(i, 1);
                    }
                  });

                  setGameDays(updated);
                }}

                showOutsideDays
                className="w-full max-w-[350px]"
                styles={{
                  months: { display: 'flex', justifyContent: 'left', width: '100%' },
                  month: { width: '100%' },
                  head_cell: { padding: '0.5rem' },
                  day: { padding: '0.4rem' },
                }}
              />
            </div>
          </div>

          {/* Selected Game Days List */}
          {gameDays.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-md mb-2 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-700" /> Selected Game Days
              </h3>
              <ul className="space-y-2">
                {gameDays.map((game, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-2 border border-gray-200 rounded p-3 text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{game.date.toDateString()}</span>
                      <button
                        onClick={() =>
                          setGameDays((prev) =>
                            prev.filter((g) => g.date.getTime() !== game.date.getTime())
                          )
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Home/Away Selector */}
                    <div>
                      <label className="text-xs font-medium text-gray-700">Home or Away</label>
                      <select
                        value={game.homeAway}
                        onChange={(e) => {
                          const value = e.target.value as "Home" | "Away";
                          setGameDays((prev) =>
                            prev.map((g) =>
                              g.date.getTime() === game.date.getTime()
                                ? { ...g, homeAway: value }
                                : g
                            )
                          );
                        }}
                        className="w-full border border-gray-300 rounded p-2 mt-1"
                      >
                        <option value="Home">Home</option>
                        <option value="Away">Away</option>
                      </select>
                    </div>

                    {/* Opponent Name */}
                    <div>
                      <label className="text-xs font-medium text-gray-700">Opponent</label>
                      <input
                        type="text"
                        value={game.opponent}
                        onChange={(e) =>
                          setGameDays((prev) =>
                            prev.map((g) =>
                              g.date.getTime() === game.date.getTime()
                                ? { ...g, opponent: e.target.value }
                                : g
                            )
                          )
                        }
                        className="w-full border border-gray-300 rounded p-2 mt-1"
                        placeholder="Team Name"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
              ) : (
              <p className="text-sm text-gray-500 mt-3 text-center">
                No game days selected yet. Click on the calendar to add.
              </p>
          )}
        </div>
      </div>
    </>
  );
}
