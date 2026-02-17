import { useState } from "react";
import { Link } from "react-router-dom";

const KEY = "fav_events";

const readStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export default function EventCard({ id, title, description, date, organizer }) {
  const eventId = Number(id);

  const [liked, setLiked] = useState(() => readStorage().includes(eventId));

  const toggleLike = () => {
    const data = readStorage();

    let updated;

    if (data.includes(eventId)) {
      updated = data.filter((x) => x !== eventId);
      setLiked(false);
    } else {
      updated = [...data, eventId];
      setLiked(true);
    }

    localStorage.setItem(KEY, JSON.stringify(updated));
  };

  return (
    <div className="col-md-4">
      <div className="card h-100">
        <div className="card-body">
          <h5>{title}</h5>
          <p>{description}</p>
          <small>
            {date}
            <br />
            {organizer}
          </small>
        </div>

        <div className="d-flex p-3 justify-content-between flex-wrap gap-2">
          <Link
            to={`/participants/${eventId}`}
            className="btn btn-outline-secondary"
          >
            View
          </Link>

          <Link to={`/register/${eventId}`} className="btn btn-outline-success">
            Register
          </Link>

          <button className="btn btn-outline-primary" onClick={toggleLike}>
            {liked ? "Liked ✓" : "Like"}
          </button>
        </div>
      </div>
    </div>
  );
}
