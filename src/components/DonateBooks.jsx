import React, { useState } from "react";
import axios from "axios";

function DonateBooks() {
  const [location, setLocation] = useState("");
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location) return alert("Enter a location first");
    setLoading(true);

    try {
      // ✅ Hit backend proxy
      const res = await axios.get("/api/v1/ngos", { params: { location } });
      setNgos(res.data.ngos || []);
    } catch (err) {
      console.error("Error fetching NGOs:", err);
      alert("Failed to fetch NGOs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">📖 Donate Your Books</h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city or area..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-600">Loading NGOs...</p>}

      <div className="mt-6 space-y-4">
        {ngos.length === 0 && !loading && (
          <p className="text-gray-500">No NGOs found for this location.</p>
        )}

        {ngos.map((ngo, idx) => (
          <div key={idx} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg">{ngo.name || "Unknown NGO"}</h3>
            
            {ngo.address ? (
              <p className="text-gray-600">{ngo.address}</p>
            ) : (
              <p className="text-gray-400 italic">Address not available</p>
            )}

            {ngo.phone && <p className="text-gray-800">📞 {ngo.phone}</p>}

            {ngo.website && (
              <a
                href={ngo.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline block"
              >
                🌐 Website
              </a>
            )}

            {ngo.lat && ngo.lon ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${ngo.lat},${ngo.lon}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline block mt-1"
              >
                📍 View on Map
              </a>
            ) : (
              <p className="text-gray-400 italic mt-1">Location not available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonateBooks;
