import React, { useEffect, useState } from "react";
import axios from "axios";
import DonateBooks from "./DonateBooks"; // 👈 import donate component

function BooksCategory({ user, onLogin }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: "",
    classOrSemester: "",
    price: "",
    image: null,
  });

  // 🔹 Fetch seller books
  const fetchBooks = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/api/v1/books/getAll-books", {
        withCredentials: true,
      });
      setBooks(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch books", err);
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBooks();
  }, [user]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // 🔹 Publish / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await axios.patch(
          "/api/v1/books/update-bookDetails",
          {
            bookId: editingBook._id,
            subjectName: formData.subjectName,
            classOrSemester: formData.classOrSemester,
            price: formData.price,
          },
          { withCredentials: true }
        );

        if (formData.image) {
          const imgData = new FormData();
          imgData.append("bookId", editingBook._id);
          imgData.append("image", formData.image);

          await axios.post("/api/v1/books/update-image", imgData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        alert("Book updated successfully!");
      } else {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) =>
          data.append(key, value)
        );

        await axios.post("/api/v1/books/list-book", data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Book published successfully!");
      }

      setShowModal(false);
      setEditingBook(null);
      setFormData({ subjectName: "", classOrSemester: "", price: "", image: null });
      fetchBooks();
    } catch (err) {
      console.error("Error saving book", err);
      alert("Failed to save book");
    }
  };

  // 🔹 Delete
  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`/api/v1/books/delete-book/${bookId}`, {
        withCredentials: true,
      });
      alert("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book", err);
      alert("Failed to delete book");
    }
  };

  // 🔹 Open modal
  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        subjectName: book.subjectName,
        classOrSemester: book.classOrSemester,
        price: book.price,
        image: null,
      });
    } else {
      setEditingBook(null);
      setFormData({ subjectName: "", classOrSemester: "", price: "", image: null });
    }
    setShowModal(true);
  };

  if (!user) {
    return (
      <div className="p-12 text-center bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">You’re not logged in</h2>
        <p className="mb-6 text-gray-600">Please log in to manage your listed books.</p>
        <button
          onClick={() => onLogin?.()}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📚 Your Listed Books</h1>
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          + Publish New Book
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading your books...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : books.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">No books found. Start publishing now!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white border rounded-xl shadow hover:shadow-xl transition p-5 flex flex-col"
            >
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.subjectName || "Book"}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              <h2 className="mt-4 font-semibold text-lg">{book.subjectName}</h2>
              <p className="text-sm text-gray-600">Class/Semester: {book.classOrSemester}</p>
              <p className="mt-2 font-bold text-green-600 text-lg">₹{book.price}</p>
              <p className="text-xs text-gray-400 mt-1">
                Seller: {book.sellerName?.fullName || "Unknown"}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openModal(book)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 DonateBooks Component */}
      <DonateBooks />
      
      {/* 🔹 Publish/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editingBook ? "Edit Book" : "Publish New Book"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="subjectName"
                placeholder="Subject Name"
                value={formData.subjectName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="text"
                name="classOrSemester"
                placeholder="Class or Semester"
                value={formData.classOrSemester}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                {editingBook ? "Update Book" : "Publish Book"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksCategory;
