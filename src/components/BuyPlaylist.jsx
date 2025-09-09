// src/components/buy/BuyPlaylist.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BuyPlaylist() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch("/api/v1/playlist/buyer-playlist"); // adjust API if needed
        console.log("Fetch Status:", res.status);
        const data = await res.json();
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          setPlaylists(data);
        } else {
          setPlaylists(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return <p className="p-8 text-center">Loading playlists...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Available Playlists</h1>

      {playlists.length === 0 ? (
        <p className="text-gray-600">No playlists available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer"
            >
              <img
                src={playlist.image}
                alt={playlist.subjectName}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold">{playlist.subjectName}</h2>
              <p className="text-gray-600">{playlist.classOrSemester}</p>
              <p className="text-sm text-gray-500 mt-1">
                Seller: {playlist.sellerName?.fullName}
              </p>
              <p className="text-sm text-gray-500">
                College: {playlist.sellerName?.collegeName}
              </p>

              {/* Instead of Buy Now, open playlist link */}
              <a
                href={playlist.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full text-center bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                View Playlist
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuyPlaylist;
