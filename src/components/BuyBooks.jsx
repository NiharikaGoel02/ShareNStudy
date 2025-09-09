// src/components/buy/BuyBooks.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatModal from "./ChatModal";

function BuyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/v1/books/buyer-books"); // adjust your API base URL if needed
        console.log("Fetch Status:", res.status);
        const data = await res.json();
        console.log("API Response:", data);
        // if (data.success) {
        //   setBooks(data.data);
        // }
        if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks(data.data || []);
      }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p className="p-8 text-center">Loading books...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Available Books</h1>

      {books.length === 0 ? (
        <p className="text-gray-600">No books available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer"
            >
              <img
                src={book.image}
                alt={book.subjectName}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold">{book.subjectName}</h2>
              <p className="text-gray-600">{book.classOrSemester}</p>
              <p className="text-gray-800 font-medium mt-2">₹{book.price}</p>
              <p className="text-sm text-gray-500 mt-1">
                Seller: {book.sellerName?.fullName}
              </p>
              <p className="text-sm text-gray-500">
                College: {book.sellerName?.collegeName}
              </p>

              <button
                onClick={() => setOpenChat(true)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Buy Now
              </button>
              {openChat && (
        <ChatModal
          buyerId={currentUser._id}
          sellerId={book.sellerId}
          onClose={() => setOpenChat(false)}
        />
      )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuyBooks;
