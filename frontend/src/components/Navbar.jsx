import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/hooks";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-gray-100"
        >
          📋 Fuzzie
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create" className="btn-primary text-sm">
                ➕ Create Listing
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-gray-200 transition"
              >
                👤 {user.username}
              </Link>
              <button onClick={handleLogout} className="btn-outline text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-gray-200 transition"
              >
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
