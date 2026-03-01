import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updateDiscord } from "../utils/api";
import { useAuth } from "../utils/hooks";
import { getListings } from "../utils/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const [discordUsername, setDiscordUsername] = useState("");
  const [editingDiscord, setEditingDiscord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userListings, setUserListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.discordUsername) {
      setDiscordUsername(user.discordUsername);
    }
  }, [user]);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const response = await getListings();
        const filtered = response.data.listings.filter(
          (listing) => listing.author?.id === user?.id,
        );
        setUserListings(filtered);
      } catch (err) {
        console.error("Failed to fetch listings");
      } finally {
        setLoadingListings(false);
      }
    };

    fetchUserListings();
  }, [user]);

  const handleUpdateDiscord = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!discordUsername.trim()) {
      setError("Discord username cannot be empty");
      return;
    }

    setLoading(true);

    try {
      await updateDiscord(discordUsername);
      setSuccess("Discord username updated successfully!");
      setEditingDiscord(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update Discord username",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="card max-w-md">
          <p className="text-gray-600 mb-4">
            Please log in to view your profile
          </p>
          <Link to="/login" className="btn-primary w-full">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card mb-8 fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                👤 {user.username}
              </h1>
              <p className="text-gray-600 mt-2">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Logout
            </button>
          </div>

          {/* Discord Section */}
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🎮 Discord Connection
            </h2>

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {editingDiscord ? (
              <form onSubmit={handleUpdateDiscord} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Discord Username
                  </label>
                  <input
                    type="text"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    className="input-field"
                    placeholder="yourname#1234"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingDiscord(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {discordUsername ? (
                  <div className="flex items-center justify-between bg-white p-4 rounded-lg mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Connected Account</p>
                      <p className="text-lg font-mono font-bold text-indigo-600">
                        {discordUsername}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingDiscord(true)}
                      className="btn-secondary"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                    <p className="text-yellow-800">
                      No Discord account connected yet
                    </p>
                  </div>
                )}
                {!discordUsername && (
                  <button
                    onClick={() => setEditingDiscord(true)}
                    className="btn-primary"
                  >
                    🔗 Connect Discord Account
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Listings */}
        <div className="fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            📝 Your Listings ({userListings.length})
          </h2>

          {loadingListings ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-4xl">⏳</div>
              <p className="mt-4 text-gray-600">Loading your listings...</p>
            </div>
          ) : userListings.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-2xl text-gray-500 mb-4">📭 No listings yet</p>
              <Link to="/create" className="btn-primary">
                ➕ Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <div key={listing.id} className="card">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-600 font-bold">
                      👍 {listing.voteCount}
                    </span>
                    <Link
                      to={`/listing/${listing._id}`}
                      className="btn-secondary text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
