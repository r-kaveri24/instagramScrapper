'use client';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Install this package: npm install react-icons
import ResultDisplay from "./components/ResultDisplay";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [showResult, setShowResult] = useState(false);

  async function handleOnClick() {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setShowContent(false);
    setShowResult(false);

    try {
      const response = await fetch('/api/scrapper', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagramUsername: username, instagramPassword: password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong!");
      }

      setResult(data);
      setTimeout(() => {
        setIsLoading(false);
        setShowResult(true);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      setShowContent(true);
    }
  }

  return (
    <div className='relative w-full h-screen overflow-hidden'>
      {/* Background Video */}
      <video className='absolute top-0 left-0 w-full h-full object-cover' autoPlay loop muted playsInline>
        <source src='/backgroundVideo.mp4' type='video/mp4' />
      </video>

      <div className="w-full h-screen backdrop-blur-xs"></div>

      {/* Animated Card */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-white/90 shadow-lg overflow-hidden flex items-center justify-center
        transition-all duration-1000 ${isLoading ? 'w-[50px] h-[50px] rounded-full animate-bounce' : 'w-[700px] h-[500px] rounded-3xl'}`}>

        {showContent && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-5 text-center px-6">
            <h1 className="font-bold text-4xl text-black font-poppins">Let's Scrape Instagram!</h1>
            <p className="text-xl italic text-black">Enter your Instagram credentials to retrieve data:</p>

            {/* Username Field */}
            <div className="flex w-full gap-6 items-center justify-between">
              <p className="w-fit font-bold text-[15px]">User ID :</p>
              <input
                type="text"
                placeholder="Enter your username..."
                className="border-2 border-black p-2 px-3 bg-white bg-opacity-70 rounded-md w-[331.22px]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password Field with Visibility Toggle */}
            <div className="relative w-full flex justify-center gap-5 items-center justify-cente">
              <p className="w-fit font-bold text-[15px]">Password:</p>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password..."
                className="border-2 border-black p-2 px-3 bg-white bg-opacity-70 rounded-md w-[80%] pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 hover:text-black "
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <span>{isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}</span>
              </button>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
              className="bg-indigo-700 p-2 px-5 rounded-2xl text-white hover:bg-indigo-800"
              onClick={handleOnClick}
            >
              Enter
            </button>
          </div>
        )}

        {/* Show result only after animation finishes */}
        {showResult && <ResultDisplay result={result} username={username} />}
      </div>
    </div>
  );
}