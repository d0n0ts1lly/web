import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Participants from "./pages/Participants";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <div className="container mt-4">
      <nav className="mb-4">
        <Link to="/" className="btn btn-outline-primary">
          Головна
        </Link>
        <Link to="/analytics" className="btn btn-outline-primary">
          Аналітика
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/register/:eventId" element={<Register />} />
        <Route path="/participants/:eventId" element={<Participants />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
