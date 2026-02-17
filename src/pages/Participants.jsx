import { useParams, Link } from "react-router-dom";
import { useState } from "react";

const STORAGE = "event_participants";

const readParticipants = (eventId) => {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE)) || {};
    return all[eventId] || [];
  } catch {
    return [];
  }
};

export default function Participants() {
  const { eventId } = useParams();

  const [list] = useState(() => readParticipants(eventId));

  return (
    <>
      <h3>Учасники події {eventId}</h3>

      {list.length === 0 && <p>Поки немає учасників</p>}

      <ul className="list-group mb-3">
        {list.map((p, i) => (
          <li key={i} className="list-group-item">
            <b>{p.name}</b>
            <br />
            {p.email}
            <br />
            {p.source}
          </li>
        ))}
      </ul>

      <Link to="/" className="btn btn-secondary">
        Назад
      </Link>
    </>
  );
}
