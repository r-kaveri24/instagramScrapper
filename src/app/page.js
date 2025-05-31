'use client';
import { useState } from "react";
import ResultDisplay from "./components/ResultDisplay";
export default function HomePage() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [showResult, setShowResult] = useState(false);

  async function handleOnClick() {
    setIsAnimating(true);
    setShowContent(false);
    setShowResult(false);

    const instagramUrl = `https://www.instagram.com/${username}/`;
    const response = await fetch('/api/scrapper', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instagramUrl })
    });
    const data = await response.json();
    setResult(data);

    setTimeout(() => {
      setIsAnimating(false);
      setShowResult(true);
    }, 1000);
  }

  const cardClasses = `
    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
    bg-white/90 shadow-lg overflow-hidden flex items-center justify-center
    transition-all duration-1000 
    ${isAnimating
      ? 'w-[50px] h-[50px] rounded-full animate-bounce'
      : 'w-[700px] h-[500px] rounded-3xl'}
  `;

  return (
    <div className='relative w-full h-screen overflow-hidden'>

      {/* Background Video */}
      <video
        className='absolute top-0 left-0 w-full h-full object-cover'
        autoPlay
        loop
        muted
        playsInline
      >
        <source src='/backgroundVideo.mp4' type='video/mp4' />
      </video>

      <div className="w-full h-screen backdrop-blur-xs"></div>

      {/* Animated Card */}
      <div className={cardClasses}>
        {showContent && !isAnimating && (
          <div className="flex flex-col items-center justify-center gap-5 text-center px-6">
            <h1 className="font-bold text-4xl text-black font-poppins">Let's Scrape Instagram!</h1>
            <p className="text-xl italic text-black">Enter the username below to collect data:</p>
            <input
              type="text"
              placeholder="Enter the user name..."
              className="border-2 border-black p-1 px-2 bg-white bg-opacity-70 rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
