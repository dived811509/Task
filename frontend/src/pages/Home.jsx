import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getListings } from "../utils/api";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const categories = ["All", "Services", "Products", "Jobs", "Events", "Other"];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getListings(
          category === "All" ? null : category,
          sort,
        );
        setListings(response.data.listings);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Fuzzie</h1>
          <p className="text-xl mb-8">
            Discover, Share, and Vote on Amazing Listings
          </p>
          <Link
            to="/create"
            className="bg-white text-indigo-600 border border-white hover:bg-indigo-600 hover:text-white inline-block px-4 py-2 rounded-md transition"
          >
            ➕ Create Your First Listing
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field"
              >
                <option value="newest">Newest First</option>
                <option value="votes">Most Voted</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-4xl">⏳</div>
            <p className="mt-4 text-gray-600">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <p className="text-2xl text-gray-500">📭 No listings found</p>
            <p className="text-gray-400 mt-2">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
