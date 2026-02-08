import { useState } from "react";

const KEY = "fav_events";

export default function EventCard({ id, title, description, date, organizer }) {
  const [liked, setLiked] = useState(false);

  const save = () => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY)) || [];
      if (!data.includes(id)) {
        data.push(id);
        localStorage.setItem(KEY, JSON.stringify(data));
      }
      setLiked(true);
    } catch {
      setLiked(false);
    }
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
        <div class="d-flex p-4 justify-content-between">
          <button className="btn btn-outline-secondary mt-2">View</button>
          <button className="btn btn-outline-primary mt-2" onClick={save}>
            {liked ? "Цікаво ✓" : "Цікаво"}
          </button>
        </div>
      </div>
    </div>
  );
}
