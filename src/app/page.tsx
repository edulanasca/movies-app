'use client';

import { useQuery } from "@apollo/client";
import AuthModal from "movieapp/components/AuthModal";
import Header from "movieapp/components/Header";
import MyFavs from "movieapp/components/MyFavs";
import TrendingList from "movieapp/components/TrendingList";
import { ME } from "movieapp/lib/queries";
import { useState } from "react";

export default function Home() {
  const [term, setTerm] = useState('');
  const [showFavs, setShowFavs] = useState(false);
  const { data } = useQuery(ME);
  const [showAuthModal, setShowAuthModal] = useState(false);

  function handleAuthModalClose () {
    setShowAuthModal(false);
  }

  function handleShowFavs () {
    if (data?.me?.username) {
      setShowFavs(!showFavs);
    } else {
      setShowAuthModal(true);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24 px-24">
      <Header username={data?.me?.username} />
      <div className="z-10 w-full max-w-5xl font-mono text-sm lg:flex justify-center">
        <div className="flex justify-center flex-col">
          <input
            className="text-black w-[340px] h-[30px] text-center placeholder-center"
            type="text"
            placeholder="Search for a movie"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <div className="flex flex-col items-center">
            <p>O</p>
            <button onClick={handleShowFavs}>{showFavs ? 'See trending' : 'See favorites'}</button>
          </div>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[300px] before:lg:h-[360px]">
      {showFavs ? <MyFavs /> : <TrendingList term={term} />}
      </div>
      {showAuthModal && <AuthModal onCancel={handleAuthModalClose} />}
    </main>
  );
}
