import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../utils/api";
import { useAuth } from "../utils/hooks";

export default function CreateListing() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Services",
    price: "",
    location: "Online",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? (value ? parseFloat(value) : "") : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    if (formData.description.length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await createListing({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price || 0,
        location: formData.location,
        imageUrl:
          formData.imageUrl || "https://via.placeholder.com/300?text=No+Image",
      });

      navigate(`/listing/${response.data.listing._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Create New Listing
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Web Design Services"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field h-32 resize-none"
                placeholder="Describe your listing in detail..."
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/2000
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Services">Services</option>
                  <option value="Products">Products</option>
                  <option value="Jobs">Jobs</option>
                  <option value="Events">Events</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price (Optional)
                </label>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="City, Country or 'Online'"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-4 h-32 rounded-lg"
                  onError={() => setError("Invalid image URL")}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? "Creating Listing..." : "🚀 Create Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
