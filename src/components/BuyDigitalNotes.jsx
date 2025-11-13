// src/components/buy/BuyDigitalNotes.jsx
import React, { useEffect, useState } from "react";

function BuyDigitalNotes() {
  const [activeTab, setActiveTab] = useState("free"); // "free" | "paid"
  const [freeNotes, setFreeNotes] = useState([]);
  const [paidNotes, setPaidNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch free notes
  useEffect(() => {
    const fetchFreeNotes = async () => {
      try {
        const res = await fetch("/api/v1/notesFree/buyer-notesFree");
        const data = await res.json();
        if (data.success) {
          setFreeNotes(data.data);
        }
      } catch (err) {
        console.error("Error fetching free notes:", err);
      }
    };

    const fetchPaidNotes = async () => {
      try {
        const res = await fetch("/api/v1/notesPaid/buyer-notesPaid");
        const data = await res.json();
        if (data.success) {
          setPaidNotes(data.data);
        }
      } catch (err) {
        console.error("Error fetching paid notes:", err);
      }
    };

    Promise.all([fetchFreeNotes(), fetchPaidNotes()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) {
    return <p className="p-8 text-center">Loading notes...</p>;
  }

  const renderFreeNotes = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {freeNotes.map((note) => (
        <div
          key={note._id}
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold">{note.subjectName}</h2>
          <p className="text-gray-600">{note.classOrSemester}</p>
          <p className="text-sm text-gray-500 mt-2">
            Seller: {note.sellerName?.fullName}
          </p>
          <p className="text-sm text-gray-500">
            College: {note.sellerName?.collegeName}
          </p>

          <a
            href={note.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block w-full bg-green-600 text-white py-2 rounded text-center hover:bg-green-700"
          >
            View / Download
          </a>
        </div>
      ))}
    </div>
  );

  const renderPaidNotes = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {paidNotes.map((note) => (
        <div
          key={note._id}
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold">{note.subjectName}</h2>
          <p className="text-gray-600">{note.classOrSemester}</p>
          <p className="text-gray-800 font-medium mt-2">₹{note.price}</p>
          <p className="text-sm text-gray-500 mt-2">
            Seller: {note.sellerName?.fullName}
          </p>
          <p className="text-sm text-gray-500">
            College: {note.sellerName?.collegeName}
          </p>

          <button
            onClick={() => alert("Redirect to payment/checkout flow")}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Buy Digital Notes</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("free")}
          className={`px-4 py-2 rounded ${
            activeTab === "free"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Free Notes
        </button>
        <button
          onClick={() => setActiveTab("paid")}
          className={`px-4 py-2 rounded ${
            activeTab === "paid"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Paid Notes
        </button>
      </div>

      {/* Listings */}
      {activeTab === "free" ? renderFreeNotes() : renderPaidNotes()}
    </div>
  );
}

export default BuyDigitalNotes;
