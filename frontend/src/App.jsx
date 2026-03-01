import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import { useAuth } from "./utils/hooks";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import ListingDetail from "./pages/ListingDetail";
import Profile from "./pages/Profile";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateListing />
            </PrivateRoute>
          }
        />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditListing />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
