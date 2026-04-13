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
    selectFilteredParticipants(state)
  );

  const { loading, error, search } = useSelector((state) => state.participants);

  useEffect(() => {
    dispatch(fetchParticipants(eventId));
  }, [eventId, dispatch]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Учасники події #{eventId}</h3>
        <Link to="/" className="btn btn-outline-secondary">
          Назад до списку
        </Link>
      </div>

      <div className="card shadow-sm p-3 mb-4">
        <input
          className="form-control"
          placeholder="Пошук за ім'ям або email..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && participants.length === 0 && (
        <div className="alert alert-info text-center">
          На цю подію ще ніхто не зареєструвався.
        </div>
      )}

      <div className="row">
        {participants.map((p) => (
          <div key={p.id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{p.fullName}</h5>{" "}
                <h6 className="card-subtitle mb-2 text-muted">{p.email}</h6>
                <p className="card-text">
                  <small className="text-muted">Звідки: {p.source}</small>
                  <br />
                  {p.birthDate && (
                    <small className="text-muted">
                      Дата народження:{" "}
                      {new Date(p.birthDate).toLocaleDateString()}
                    </small>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
