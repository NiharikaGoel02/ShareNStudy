import React, { useEffect, useState } from "react";
import axios from "axios";

const PlaylistsCategory = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: "",
    classOrSemester: "",
    link: "",
    image: null,
  });

  // fetch playlists
  const fetchPlaylists = async () => {
  setLoading(true);
  try {
    const response = await axios.get("/api/v1/playlist/my-playlists", {
      withCredentials: true,
    });
    //console.log("req.user in /my-playlists:", req.user);
    //console.log("Playlists found:", response.data.data.length);
    setPlaylists(response.data.data || []);
  } catch (err) {
    console.error("Failed to fetch playlists", err);
    setError("Failed to load playlists. Please try again.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchPlaylists();
  }, []);

  // open modal
  const openModal = (playlist = null) => {
    if (playlist) {
      setEditingPlaylist(playlist);
      setFormData({
        subjectName: playlist.subjectName,
        classOrSemester: playlist.classOrSemester,
        link: playlist.link,
        image: null,
      });
    } else {
      setEditingPlaylist(null);
      setFormData({
        subjectName: "",
        classOrSemester: "",
        link: "",
        image: null,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlaylist(null);
    setFormData({
      subjectName: "",
      classOrSemester: "",
      link: "",
      image: null,
    });
  };

  // handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // add playlist
  const handleAddPlaylist = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("subjectName", formData.subjectName);
      data.append("classOrSemester", formData.classOrSemester);
      data.append("link", formData.link);
      data.append("image", formData.image);

      await axios.post("/api/v1/playlist/list-playlist", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchPlaylists();
      closeModal();
    } catch (error) {
      console.error("Error adding playlist", error);
    }
  };

  // update playlist details
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        "/api/v1/playlist/update-playlistDetails",
        {
          playlistId: editingPlaylist._id,
          subjectName: formData.subjectName,
          classOrSemester: formData.classOrSemester,
          link: formData.link,
        },
        { withCredentials: true }
      );

      // update image if new one is selected
      if (formData.image) {
        const imgData = new FormData();
        imgData.append("playlistId", editingPlaylist._id);
        imgData.append("image", formData.image);

        await axios.post("/api/v1/playlist/update-image", imgData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchPlaylists();
      closeModal();
    } catch (error) {
      console.error("Error updating playlist", error);
    }
  };

  // delete playlist
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/playlist/delete-playlist/${id}`, {
        withCredentials: true,
      });
      fetchPlaylists();
    } catch (error) {
      console.error("Error deleting playlist", error);
    }
  };

  if (loading) return <p>Loading playlists...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Playlists</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <p>No playlists available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div key={pl._id} className="border rounded p-4 shadow">
              <img
                src={pl.image}
                alt={pl.subjectName}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-bold mt-2">{pl.subjectName}</h3>
              <p className="text-gray-600">Class/Sem: {pl.classOrSemester}</p>
              <a
                href={pl.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Watch Playlist
              </a>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openModal(pl)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pl._id)}
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
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingPlaylist ? "Edit Playlist" : "Add Playlist"}
            </h2>
            <form
              onSubmit={
                editingPlaylist ? handleUpdateDetails : handleAddPlaylist
              }
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
              <input
                type="text"
                name="link"
                placeholder="Playlist Link"
                value={formData.link}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="border p-2 rounded"
                accept="image/*"
                {...(!editingPlaylist ? { required: true } : {})}
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
                  className="px-4 py-1 bg-green-600 text-white rounded"
                >
                  {editingPlaylist ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsCategory;
