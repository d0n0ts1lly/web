import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchParticipants,
  setSearch,
  selectFilteredParticipants,
} from "../store/participantsSlice";

export default function Participants() {
  const { eventId } = useParams();
  const dispatch = useDispatch();

  const participants = useSelector((state) =>
    selectFilteredParticipants(state, eventId)
  );
  const { loading, error, search } = useSelector((state) => state.participants);

  useEffect(() => {
    dispatch(fetchParticipants(eventId));
  }, [eventId, dispatch]);

  return (
    <>
      <h3>Учасники події {eventId}</h3>

      <input
        className="form-control mb-3"
        placeholder="Пошук за ім'ям або email..."
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />

      {loading && <div className="spinner-border mb-3" />}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && participants.length === 0 && <p>Поки немає учасників</p>}

      <ul className="list-group mb-3">
        {participants.map((p) => (
          <li key={p.id} className="list-group-item">
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
