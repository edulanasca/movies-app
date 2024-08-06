'use client';

import { useQuery } from "@apollo/client";
import AuthModal from "movieapp/components/AuthModal";
import Header from "movieapp/components/Header";
import MyFavs from "movieapp/components/MyFavs";
import TrendingList from "movieapp/components/TrendingList";
import { ME } from "movieapp/lib/queries";
import { useState, useEffect, useCallback } from "react";
import debounce from 'lodash/debounce';

export default function Home() {
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [showFavs, setShowFavs] = useState(false);
  const { data } = useQuery(ME);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Create a debounced function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setDebouncedTerm(searchTerm);
    }, 300),
    []
  );

  // Update the search term and trigger the debounced search
  useEffect(() => {
    debouncedSearch(term);
  }, [term, debouncedSearch]);

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
    <main className="flex min-h-screen flex-col items-center justify-between pb-12 px-4 sm:px-24">
      <Header username={data?.me?.username} />
      <div className="z-10 w-full max-w-5xl font-mono text-sm flex justify-center mt-8">
        <div className="flex flex-col items-center w-full sm:w-auto">
          <input
            className="text-black dark:text-black w-full sm:w-[340px] h-[40px] text-center placeholder-center mb-4 sm:mb-4 sm:mr-4"
            type="text"
            placeholder="Search for a movie"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button 
            onClick={handleShowFavs}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            {showFavs ? 'See trending' : 'See favorites'}
          </button>
        </div>
      </div>

      <div className="relative flex flex-col sm:items-center place-items-center mt-8 w-full max-w-5xl">
        {showFavs ? <MyFavs /> : <TrendingList debouncedTerm={debouncedTerm} />}
      </div>
      {showAuthModal && <AuthModal onCancel={handleAuthModalClose} />}
    </main>
  );
}