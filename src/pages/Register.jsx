import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";

const STORAGE = "event_participants";

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  birth: z.string().refine((val) => {
    const age = (Date.now() - new Date(val)) / (365.25 * 24 * 3600 * 1000);
    return age >= 18;
  }, "18+ only"),
  source: z.string().min(1),
});

export default function Register() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    birth: "",
    source: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();

    const res = schema.safeParse(form);

    if (!res.success) {
      const err = {};
      res.error.issues.forEach((x) => {
        err[x.path[0]] = x.message;
      });
      setErrors(err);
      return;
    }

    const all = JSON.parse(localStorage.getItem(STORAGE)) || {};

    if (!all[eventId]) all[eventId] = [];

    all[eventId].push(form);

    localStorage.setItem(STORAGE, JSON.stringify(all));

    navigate(`/participants/${eventId}`);
  };

  return (
    <form onSubmit={submit}>
      <h3>Реєстрація на подію {eventId}</h3>

      <input
        className="form-control mb-2"
        placeholder="ПІБ"
        name="name"
        onChange={handleChange}
      />
      <div className="text-danger">{errors.name}</div>

      <input
        className="form-control mb-2"
        placeholder="Email"
        name="email"
        onChange={handleChange}
      />
      <div className="text-danger">{errors.email}</div>

      <input
        type="date"
        className="form-control mb-2"
        name="birth"
        onChange={handleChange}
      />
      <div className="text-danger">{errors.birth}</div>

      <select
        className="form-control mb-3"
        name="source"
        onChange={handleChange}
      >
        <option value="">Джерело</option>
        <option>Instagram</option>
        <option>Friends</option>
        <option>Ads</option>
      </select>
      <div className="text-danger">{errors.source}</div>

      <button className="btn btn-primary">Зареєструватися</button>
    </form>
  );
}
