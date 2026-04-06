import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Participants from "./pages/Participants";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 px-3 rounded">
        <div className="container-fluid">
          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-outline-primary">
              Головна
            </Link>
            <Link to="/analytics" className="btn btn-outline-primary">
              Аналітика
            </Link>
          </div>

          <div className="ms-auto">
            {isAuthenticated ? (
              <span className="badge bg-success p-2">
                Організатор: {user.username}
              </span>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Увійти
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/register/:eventId" element={<Register />} />
        <Route
          path="/participants/:eventId"
          element={
            <PrivateRoute>
              <Participants />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
