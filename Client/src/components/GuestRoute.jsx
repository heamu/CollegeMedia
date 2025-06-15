import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    // User is logged in, redirect to home or dashboard
    return <Navigate to="/" replace />;
  }
  // User is not logged in, show the page
  return children;
}

export default GuestRoute;