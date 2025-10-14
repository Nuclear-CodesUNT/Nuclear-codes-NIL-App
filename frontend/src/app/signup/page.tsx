"use client";
import { useState } from "react";

export default function App() {
  const [selected, setSelected] = useState<number | null>(null); // React function to update ui when buttons or text fields are used

  //Profile button info
  const buttons = [
    { id: 1, icon: "PlayerIcon" , name: "Player", description: "Showcase your skills and connect with coaches" },
    { id: 2, icon: "CoachIcon" , name: "Coach", description: "Discover talent and build your team" },
    { id: 3, icon: "MentorIcon", name: "Mentor", description: "Guide athletes in their career development" },
  ];

 return (
  <div className="min-h-screen">
      {/* Header Section*/}
      <div className="text-center mt-8 mb-6 px-4">
        <h2 className="text-3xl font-bold text-black mb-2">Create Your Account</h2>
        <p className="text-gray-600 text-lg">
          Join our community of athletes, coaches, and mentors
        </p>
      </div>
      
      {/* Profile type Frame */}
      <div className="flex justify-center items-center p-4">
        <div
          className={`
            flex flex-col                    {/* Flex box column layout */}
            w-full max-w-5xl                 {/* Scale to max with, reduce max width to leave padding */}
            bg-white rounded-3xl shadow-md   {/* Background color, add rounded corners */}
            border border-gray-300           {/* Border color */}
            pt-4 px-8 pb-8                   {/* Padding for top, sides, and bottom}
          `}
        >
          {/* Choose Title */}
          <h2 className="text-xl font-bold text-black mb-4">Choose Your Role</h2>

          {/* Buttons */}
          <div
            className={`
              flex flex-col md:flex-row   {/* Stack buttons vertically, row on larger screens */}
              w-full gap-4                {/* Full width, space between buttons */}
            `}
          >
            {buttons.map((btn) => (  // Fetch array of button const and create button element for each
              <button
                key={btn.id} // Create id for each created button
                onClick={() => setSelected(btn.id)} // Onclick function for each button
                className={`
                  flex flex-col items-center justify-center   {/* Center vertically/Horizontally */}
                  p-6 rounded-2xl transition border-2 flex-1  {/* Add Padding, transition effect */}
                  ${
                    selected === btn.id
                      ? "border-black"                          // Border color 
                      : "border-gray-300 hover:border-gray-400" // On hover effect color 
                }`}
              >
                <div className="text-4xl mb-2">{btn.icon}</div>                  {/* Button icon/text placeholder */}
                <span className="font-bold text-black text-lg">{btn.name}</span> {/* Button name */}
                <span className="text-sm text-gray-500 text-center mt-1">        {/* Button description */}
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
            flex flex-col                     {/* Vertical layout for columns */}
            w-full max-w-5xl                  {/* Full width, reduced max width */}
            bg-white rounded-3xl              {/* Background color, add rounded corners */}
            shadow-md border border-gray-300  {/* Border color */}
            p-8 space-y-6                     {/* Padding all around, vertical spacing */}
          `}
        >
          {/* Profile information title */}
          <h2 className="text-xl font-bold text-black mb-4">Profile Information</h2>

          {/* Profile Picture */}
          <div className="flex flex-col items-center">
          {/* Icon Container */}
          <div className="relative">
            {/* Main avatar/login icon */}
            <div
              className={`
                w-24 h-24 rounded-full            {/* Square frame becomes circle */}
                bg-gray-200                       {/* Background color */}
                flex items-center justify-center  {/* Center the icon horizontally and vertically */}
                text-4xl text-gray-400            {/* Large gray icon */}
              `}
            >
              👤  {/* Upload profile picture main icon/Placeholder */}
            </div>

            {/* Small upload button with slight over lap with above icon */}
            <label
              htmlFor="profile-upload"
              className={`
                absolute bottom-0 right-0        {/* Position at bottom right corner */}
                bg-black text-white              {/* Black background, white icon */}
                w-8 h-8 rounded-full             {/* Small circular button */}
                flex items-center justify-center {/* Center upload icon */}
                cursor-pointer hover:bg-gray-800 transition {/* Hover effect */}
              `}
            >
            ⬆️ {/* Upload profile picture button icon/Placeholder */}
            </label>

            {/* Upload file */}
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Description */}
          <div className="text-center mt-2 text-black text-sm">
            <div>Upload Profile Picture</div>
            <div className="text-gray-500">JPG, PNG up to 10MB</div>
          </div>
        </div>

          {/* Name and Email Fields */}
          <div className="grid md:grid-cols-2 gap-4"> {/* Grid layout */}
            {/* First name */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
              />
            </div>
            {/* Last name */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1 text-black">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
              />
            </div>
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-black">Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
            />
          </div>
          {/* First name */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-black">School/University</label>
            <input
              type="text"
              placeholder="Enter your school or university"
              className="border border-gray-300 p-2 rounded-md text-black placeholder-gray-400"
            />
          </div>

          {/* Current Year Selection */}
          <div className="grid md:grid-cols-2 gap-4"> {/* Grid layout */}
            <div className="flex flex-col">   {/* Stack labels vertically */}
              <label className="font-semibold mb-1 text-black">Current Year</label> 
              <select
                defaultValue=""
                className="border border-gray-300 p-2 rounded-md text-black"
              >
                {/* Current year drop down options */}
                <option value="" disabled>
                  Select year
                </option>
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
                defaultValue=""
                className="border border-gray-300 p-2 rounded-md text-black"
              >
                {/* Current sport drop down option */}
                <option value="" disabled>
                  Select sport
                </option>
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
              placeholder="Enter your position"
              className={`
                border border-gray-300    {/* Border Color */}
                p-2 rounded-md            {/* Inner padding and rounded corners */}
                text-black                {/* Text color */}
                placeholder-gray-400      {/* Faded placeholder text */}
              `}
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1 text-black">Bio</label>
            <textarea
              rows={4}
              placeholder="Tell us a little about yourself..."
              className={`
                border border-gray-300   {/* Border Color */}
                p-2 rounded-md           {/* Inner padding and rounded corners */}
                text-black               {/* Text color */}
                placeholder-gray-400     {/* Faded placeholder text */}
              `}
            />
          </div>
        </div>
      </div>

      {/* Upload Highlights frame */}
      <div className="flex justify-center items-center p-4 mt-6"> {/* Center the frame add padding and top margin */}
        <div
          className={`
            flex flex-col                        {/* Stack vertically */}
            w-full max-w-5xl                     {/* Full width, reduce max width */}
            bg-white rounded-3xl                 {/* Background color, rounded corners */}
            shadow-md border border-gray-300     {/* Border color */}
            p-8 space-y-6                        {/* Padding and vertical spacing between sections */}
          `}
        >
          {/* Frame Title with Icon */}
          <div className="flex items-center gap-2"> {/* Align icon and title horizontally with space between */}
            <div className="text-2xl text-gray-400">🎬</div> {/* Icon place holder */}
            <h2 className="text-xl font-bold text-black">Upload Highlights</h2> {/* Title */}
          </div>

          {/* Upload Button */}
          <div>
            <label
              htmlFor="highlights-upload"
              className={`
                flex flex-col items-center justify-center 
                w-full h-40                               
                border-2 border-dashed border-gray-400      
                rounded-2xl                                
                cursor-pointer                           
                hover:border-black transition          
                p-4 text-center                            
              `}
            >
            {/* Icon and description */}
            <div className="text-4xl text-gray-400 mb-2">⬆️</div> {/* Upload icon place holder */}
            <div className="text-black font-semibold">Upload your highlights videos and photos</div> {/* Description */}
            <div className="text-gray-500 text-sm mt-1">MP4, MOV, JPG, PNG up to 50MB each</div>

            {/* Upload highlight */}
            </label>
            <input
              id="highlights-upload"
              type="file"
              accept="video/mp4,video/mov,image/png,image/jpg,image/jpeg"
              multiple
              className="hidden"
            />

            {/* Cancel Button */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => console.log("Cancel Clicked")} // Create/change function for cancel account creation
                className={`
                  px-4 py-2 
                  bg-gray-300 
                  text-gray-800 
                  rounded-lg 
                  hover:bg-gray-400 transition`}
              >
              Cancel
              </button>

              {/* Finish create account button */}
              <button
                type="button"
                onClick={() => console.log("Create Account clicked")} // Create/change function for account creation
                className={`
                  px-4 py-2 
                  bg-blue-600 
                  text-white 
                  rounded-lg 
                  hover:bg-blue-700 transition`}
              >
              Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


