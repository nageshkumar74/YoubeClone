import { useState, useEffect, useRef } from "react";
import Spinner from "../Spinner";
import MovieCard from "./MovieCard";
import axios from "axios";
import { useDebounce } from "react-use";
import { useUser, UserButton, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { updateSearchCount } from "../../Appwrite";
import { Search as SearchIcon } from "lucide-react";

const API_KEY = "AIzaSyCqeuB-H1TlrSacpAzdTpPYIo9TkVlVCWc";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("React tutorials");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const [debounceSearchterm, setDebounceSearchTerm] = useState(searchTerm);
  const lastQuery = useRef("");

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    async function fetchData(query = "") {
      if (query === lastQuery.current) return;
      lastQuery.current = query;
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
          params: {
            part: "snippet",
            q: query,
            key: API_KEY,
            maxResults: 10,
            type: "video",
          },
        });

        const results = response.data.items || [];
        setMovieList(results);

        if (query && results.length > 0) {
          await Promise.all(results.map((item) => updateSearchCount(query, item)));
        }
      } catch (error) {
        console.error("Error Fetching videos:", error);
        setErrorMessage("Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    }

    if (debounceSearchterm) {
      fetchData(debounceSearchterm);
    }
  }, [debounceSearchterm]);

  return (
    <>
      <SignedIn>
        <main className="bg-black min-h-screen text-white">
          <div className="flex items-center justify-between px-4 md:px-10 py-4 border-b border-gray-800 shadow-md backdrop-blur-md">
            <img src="/YouTube-Logo.wine.svg" alt="YouTube" className="h-20 w-auto" />
            <div className="flex items-center space-x-4">
              <p className="text-white text-lg">Welcome, {user?.firstName || "User"}</p>
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>

          <div className="wrapper px-4 md:px-8">
            <header className="text-center mt-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Find <span className="text-gradient">YouTube Videos</span> You'll Enjoy
              </h1>

              <div className="relative w-full max-w-2xl mx-auto mb-8">
                <input
                  type="text"
                  placeholder="Search React tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-12 py-3 text-white bg-gray-800 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                />
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </header>

            <section className="all-movies mt-10">
              <h2 className="text-2xl font-semibold mb-4">All Videos</h2>
              {loading ? (
                <Spinner />
              ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movieList.map((video) => (
                    <MovieCard key={video.id.videoId} movie={video} />
                  ))}
                </ul>
              )}
            </section>
          </div>
        </main>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default Dashboard;
