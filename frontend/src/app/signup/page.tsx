"use client";
import { useState } from "react";


export default function App() {
  const [selected, setSelected] = useState<number | null>(null); // React function to update ui when buttons or text fields are used

  //Profile button info
  const buttons = [
    { id: 1, icon: "PlayerIcon" , name: "Player", description: "Showcase your skills and connect with coaches" },
    { id: 2, icon: "CoachIcon" , name: "Coach", description: "Discover talent and build your team" },
    { id: 3, icon: "LawyerIcon", name: "Lawyer", description: "Guide athletes in their career development" },
  ];

 return (
  <div className="min-h-screen bg-gray-100">
      {/* Header Section Below Nav */}
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
            {buttons.map((btn) => (  // Fetch array of button const and create button element for each
              <button
                key={btn.id} // Create id for each created button
                onClick={() => setSelected(btn.id)} // Onclick function for each button
                className={`
                  flex flex-col items-center justify-center   
                  p-6 rounded-2xl transition border-2 flex-1  
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
            flex flex-col                     
            w-full max-w-5xl                  
            bg-white rounded-3xl             
            shadow-md border border-gray-300  
            p-8 space-y-6                     
          `}
        >
          

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

        

          {/* Cancel Button */}
            <div className="flex justify-end gap-4 mt-6">
              

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
  );
}


