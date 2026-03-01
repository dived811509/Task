import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getListing, deleteListing } from "../utils/api";
import { useAuth } from "../utils/hooks";
import VoteButton from "../components/VoteButton";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await getListing(id);
        setListing(response.data.listing);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      await deleteListing(id);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl">⏳</div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <p className="text-red-600 text-lg font-medium mb-4">
            {error || "Listing not found"}
          </p>
          <Link to="/" className="btn-primary">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-700 font-medium mb-6 inline-block"
        >
          ← Back to Listings
        </Link>

        <div className="card fade-in">
          {/* Image */}
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-4 py-2 rounded-full">
                  {listing.category}
                </span>
                {listing.price > 0 && (
                  <span className="text-3xl font-bold text-green-600">
                    ${listing.price}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {listing.title}
              </h1>

              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Author Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  📋 Listed by
                </h3>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {listing.author?.username || "Anonymous"}
                </p>
                {listing.authorDiscord && (
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <span>🎮 Discord:</span>
                    <code className="bg-white px-2 py-1 rounded">
                      {listing.authorDiscord}
                    </code>
                  </div>
                )}
                {listing.author?.email && user?.id === listing.author._id && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📧 Email:</span>
                    <code className="bg-white px-2 py-1 rounded">
                      {listing.author.email}
                    </code>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">📍 Location</p>
                  <p className="text-lg font-medium text-gray-800">
                    {listing.location}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">📅 Posted</p>
                  <p className="text-lg font-medium text-gray-800">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="card sticky top-24">
                <div className="mb-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="text-4xl">👍</span>
                    <div>
                      <p className="text-xs text-gray-600">Community Votes</p>
                      <p className="text-2xl font-bold text-green-600">
                        {listing.voteCount}
                      </p>
                    </div>
                  </div>
                </div>

                <VoteButton listing={listing} />

                {/* Owner Actions */}
                {user?.id === listing.author?._id && (
                  <div className="mt-6 flex gap-3 flex-col">
                    <Link
                      to={`/edit/${listing._id}`}
                      className="btn-secondary text-center"
                    >
                      ✏️ Edit Listing
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      🗑️ Delete Listing
                    </button>
                  </div>
                )}

                {/* Contact */}
                {user?.id !== listing.author?._id && (
                  <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-blue-700 font-medium">
                      💬 Want to contact them? Find them on Discord!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
