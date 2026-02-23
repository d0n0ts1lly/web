import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Participants from "./pages/Participants";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="container mt-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/:eventId" element={<Register />} />
        <Route path="/participants/:eventId" element={<Participants />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
