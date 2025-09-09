// src/components/PaidNotes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function PaidNotes({ user, onLogin }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("/api/v1/notesPaid/getAll-notesPaid", {
          withCredentials: true,
        });
        setNotes(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch paid notes", err);
        setError("Failed to load paid notes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  // If not logged in
  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4 text-red-600 font-semibold">
          Please log in to view paid notes.
        </p>
        <button
          onClick={() => onLogin?.()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Log In
        </button>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading paid notes, please wait...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  // Notes listing
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Paid Notes</h1>
      {notes.length === 0 ? (
        <p className="text-gray-500">No paid notes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="border rounded-lg shadow p-4 hover:shadow-lg transition"
            >
              {/* Thumbnail */}
              {note.image ? (
                <img
                  src={note.image}
                  alt={note.subjectName}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              {/* Details */}
              <h2 className="mt-4 font-semibold text-lg">{note.subjectName}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Class/Semester: {note.classOrSemester}
              </p>
              <p className="mt-2 font-bold text-green-600">₹{note.price}</p>
              <p className="text-xs mt-1 text-gray-400">
                Seller: {note.sellerName?.fullName || "Unknown"}
              </p>
              <p className="text-xs mt-1 text-gray-400">
                College: {note.collegeName?.collegeName || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaidNotes;
