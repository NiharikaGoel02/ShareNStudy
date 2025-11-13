import React, { useState, useEffect } from "react";
import axios from "axios";

function DigitalNotesCategory({ user, onLogin }) {
  const [activeTab, setActiveTab] = useState("free"); // free | paid
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [formData, setFormData] = useState({
    subjectName: "",
    classOrSemester: "",
    price: "",
    file: null, // pdf for free, image for paid
  });

  // fetch notes
const fetchNotes = async () => {
  if (!user) return;
  setLoading(true);
  setError("");
  try {
    const endpoint =
      activeTab === "free"
        ? "/api/v1/notesFree/my-notesFree"
        : "/api/v1/notesPaid/my-notesPaid"; // ✅ switch to "my" endpoints
    const res = await axios.get(endpoint, { withCredentials: true });

    //console.log("req.user in /my-notes:", req.user);
    //console.log("Notes found:", res.data.data.length);

    setNotes(res.data.data || []);
  } catch (err) {
    console.error("Failed to fetch notes", err);
    setError("Failed to load notes. Please try again.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchNotes();
  }, [user, activeTab]);

  // open/close modal
  const openModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        subjectName: note.subjectName,
        classOrSemester: note.classOrSemester,
        price: note.price || "",
        file: null,
      });
    } else {
      setEditingNote(null);
      setFormData({
        subjectName: "",
        classOrSemester: "",
        price: "",
        file: null,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormData({
      subjectName: "",
      classOrSemester: "",
      price: "",
      file: null,
    });
  };

  // handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // add free/paid note
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("subjectName", formData.subjectName);
      data.append("classOrSemester", formData.classOrSemester);
      if (activeTab === "paid") data.append("price", formData.price);
      data.append(activeTab === "free" ? "pdf" : "image", formData.file);

      const endpoint =
        activeTab === "free"
          ? "/api/v1/notesFree/list-notesFree"
          : "/api/v1/notesPaid/list-notesPaid";

      await axios.post(endpoint, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchNotes();
      closeModal();
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  // update free/paid note
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "free") {
        await axios.patch(
          "/api/v1/notesFree/update-notesFreeDetails",
          {
            notesId: editingNote._id,
            subjectName: formData.subjectName,
            classOrSemester: formData.classOrSemester,
          },
          { withCredentials: true }
        );
        if (formData.file) {
          const pdfData = new FormData();
          pdfData.append("notesId", editingNote._id);
          pdfData.append("pdf", formData.file);
          await axios.post("/api/v1/notesFree/update-image", pdfData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        await axios.patch(
          "/api/v1/notesPaid/update-notesPaidDetails",
          {
            notesId: editingNote._id,
            subjectName: formData.subjectName,
            classOrSemester: formData.classOrSemester,
            price: formData.price,
          },
          { withCredentials: true }
        );
        if (formData.file) {
          const imgData = new FormData();
          imgData.append("notesId", editingNote._id);
          imgData.append("image", formData.file);
          await axios.post("/api/v1/notesPaid/update-image", imgData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }
      fetchNotes();
      closeModal();
    } catch (err) {
      console.error("Error updating note", err);
    }
  };

  // delete note
  const handleDelete = async (id) => {
    try {
      const endpoint =
        activeTab === "free"
          ? `/api/v1/notesFree/delete-notesFree/${id}`
          : `/api/v1/notesPaid/delete-notesPaid/${id}`;
      await axios.delete(endpoint, { withCredentials: true });
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note", err);
    }
  };

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4 text-red-600 font-semibold">
          Please log in to view digital notes.
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Digital Notes</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("free")}
          className={`px-4 py-2 rounded ${
            activeTab === "free"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Free Notes
        </button>
        <button
          onClick={() => setActiveTab("paid")}
          className={`px-4 py-2 rounded ${
            activeTab === "paid"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Paid Notes
        </button>
        <button
          onClick={() => openModal()}
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
        >
          + Add {activeTab === "free" ? "Free" : "Paid"} Note
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading {activeTab} notes...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}

      {/* Notes */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="border rounded shadow p-4">
              {activeTab === "free" ? (
                <a
                  href={note.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View PDF
                </a>
              ) : (
                <>
                  <img
                    src={note.image}
                    alt={note.subjectName}
                    className="w-full h-40 object-cover rounded"
                  />
                  <p className="text-green-600 font-bold">₹{note.price}</p>
                </>
              )}
              <h2 className="mt-2 font-semibold">{note.subjectName}</h2>
              <p className="text-sm text-gray-600">
                Class/Semester: {note.classOrSemester}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openModal(note)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingNote
                ? `Edit ${activeTab === "free" ? "Free" : "Paid"} Note`
                : `Add ${activeTab === "free" ? "Free" : "Paid"} Note`}
            </h2>
            <form
              onSubmit={editingNote ? handleUpdate : handleAdd}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                name="subjectName"
                placeholder="Subject Name"
                value={formData.subjectName}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="classOrSemester"
                placeholder="Class / Semester"
                value={formData.classOrSemester}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              {activeTab === "paid" && (
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
              )}
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="border p-2 rounded"
                accept={activeTab === "free" ? ".pdf" : "image/*"}
                {...(!editingNote ? { required: true } : {})}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-blue-600 text-white rounded"
                >
                  {editingNote ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DigitalNotesCategory;
