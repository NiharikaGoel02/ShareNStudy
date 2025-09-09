import React from "react";
import { Link } from "react-router-dom";

function ProtectedList({ user, listings, renderItem }) {
  if (!user) {
    return (
      <div className="text-center p-6 bg-gray-100 rounded-xl shadow-md">
        <p className="text-lg font-semibold mb-3">You need to log in to see the listings.</p>
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-100 rounded-xl shadow-md">
        <p className="text-lg font-semibold">No listings available.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((item, index) => (
        <div key={index} className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export default ProtectedList;
