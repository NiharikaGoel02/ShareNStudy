import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";

function ProfilePage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [listingCounts, setListingCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Axios interceptor for refresh token logic
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await axios.post(
              "/api/v1/users/refresh-token",
              {},
              { withCredentials: true }
            );
            const newAccessToken = res.data.data.accessToken;
            // set new token in headers for retry
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (err) {
            console.error("Refresh token failed, logging out");
            window.location.href = "/login"; // logout/redirect
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      try {
        const userRes = await axios.get("/api/v1/users/current-user", {
          withCredentials: true,
        });
        setCurrentUser(userRes.data.data);
        setFullName(userRes.data.data.fullName);
        setCollegeName(userRes.data.data.collegeName);

        const listingRes = await axios.get("/api/v1/users/getTotalListings", {
          withCredentials: true,
        });
        setListingCounts(listingRes.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateAccount = async () => {
    try {
      await axios.patch(
        "/api/v1/users/update-account",
        { fullName, collegeName },
        { withCredentials: true }
      );
      setCurrentUser((prev) => ({ ...prev, fullName, collegeName }));
      setShowUpdateModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update account");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.post(
        "/api/v1/users/change-password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      setShowPasswordModal(false);
      alert("Password changed successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  if (loading)
    return <p className="p-10 text-center text-gray-600">Loading profile...</p>;
  if (error) return <p className="p-10 text-center text-red-600">{error}</p>;
  if (!currentUser)
    return <p className="p-10 text-center text-gray-600">No user data found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

      {/* User Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <div className="space-y-3">
          <p className="text-lg">
            <span className="font-semibold">Name:</span> {currentUser.fullName}
          </p>
          <p className="text-lg">
            <span className="font-semibold">College:</span>{" "}
            {currentUser.collegeName}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {currentUser.email}
          </p>
        </div>
      </div>

      {/* Listings Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">My Listings</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="font-semibold">Books</p>
            <p className="text-2xl">{listingCounts.booksCount || 0}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="font-semibold">Paid Notes</p>
            <p className="text-2xl">{listingCounts.notesPaidCount || 0}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <p className="font-semibold">Free Notes</p>
            <p className="text-2xl">{listingCounts.notesFreeCount || 0}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="font-semibold">Playlists</p>
            <p className="text-2xl">{listingCounts.playlistCount || 0}</p>
          </div>
        </div>
        <p className="mt-4 text-lg font-semibold">
          Total: {listingCounts.total || 0}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => setShowUpdateModal(true)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Update Account Details
        </button>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Change Password
        </button>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <Modal onClose={() => setShowUpdateModal(false)}>
          <h2 className="text-xl font-bold mb-4">Update Account</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="College Name"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <button
            onClick={handleUpdateAccount}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </Modal>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <button
            onClick={handleChangePassword}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Change Password
          </button>
        </Modal>
      )}
    </div>
  );
}

export default ProfilePage;
