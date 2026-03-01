import { useState, useEffect } from "react";
import { voteListing, checkVote } from "../utils/api";
import { useAuth } from "../utils/hooks";

export default function VoteButton({ listing }) {
  const { token } = useAuth();
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voteCount, setVoteCount] = useState(listing.voteCount || 0);

  useEffect(() => {
    if (token && listing._id) {
      checkVoteStatus();
    }
  }, [token, listing._id]);

  const checkVoteStatus = async () => {
    try {
      const response = await checkVote(listing._id);
      setVoted(response.data.voted);
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Please login to vote");
      return;
    }

    setLoading(true);
    try {
      const response = await voteListing(listing._id);
      setVoted(response.data.voted);
      setVoteCount(response.data.voteCount);
    } catch (error) {
      console.error("Error voting:", error);
      alert(error.response?.data?.message || "Error voting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
        voted
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <span className="text-lg">{voted ? "👍" : "🤍"}</span>
      <span>{voteCount}</span>
    </button>
  );
}
