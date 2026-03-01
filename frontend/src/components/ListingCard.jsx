import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../utils/hooks";
import VoteButton from "./VoteButton";
import { deleteListing } from "../utils/api";

export default function ListingCard({ listing }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="card fade-in group">
      <img
        src={listing.imageUrl}
        alt={listing.title}
        className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition"
      />

      <div className="flex items-center justify-between mb-2">
        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
          {listing.category}
        </span>
        {listing.price > 0 && (
          <span className="text-lg font-bold text-green-600">
            ${listing.price}
          </span>
        )}
      </div>

      <Link to={`/listing/${listing._id}`}>
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition">
          {listing.title}
        </h3>
      </Link>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {listing.description}
      </p>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-700 font-medium">
          👤 {listing.authorUsername}
        </p>
        {listing.authorDiscord && (
          <p className="text-xs text-gray-600">
            🎮 Discord:{" "}
            <span className="font-mono">{listing.authorDiscord}</span>
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">📍 {listing.location}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <VoteButton listing={listing} />
        <Link to={`/listing/${listing._id}`} className="btn-secondary text-sm">
          View Details
        </Link>
      </div>

      {/* owner actions if current user is author */}
      {user?.id === listing.author?.id && (
        <div className="mt-2 flex justify-end gap-2">
          <Link
            to={`/edit/${listing._id}`}
            className="text-indigo-600 text-sm hover:underline"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={async () => {
              if (!window.confirm("Delete this listing?")) return;
              try {
                await deleteListing(listing._id);
                // optionally you could trigger a refresh by reloading page
                navigate(0);
              } catch (err) {
                alert(
                  err.response?.data?.message || "Failed to delete listing",
                );
              }
            }}
            className="text-red-600 text-sm hover:underline"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
