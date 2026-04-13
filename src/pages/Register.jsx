import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().min(3, "ПІБ має бути не менше 3 символів"),
  email: z.string().email("Невірний формат Email"),
  birth: z.string().refine((val) => {
    const age = (Date.now() - new Date(val)) / (365.25 * 24 * 3600 * 1000);
    return age >= 18;
  }, "Тільки для повнолітніх (18+)"),
  source: z.string().min(1, "Оберіть джерело"),
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const submit = async (e) => {
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

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: Number(eventId),
          fullName: form.name,
          email: form.email,
          birthDate: form.birth,
          source: form.source,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка при реєстрації");
      }

      toast.success("Ви успішно зареєстровані!");
      navigate(`/participants/${eventId}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4 text-center">Реєстрація на подію #{eventId}</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <input
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="ПІБ"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.name}</div>
        </div>

        <div className="mb-2">
          <input
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <div className="mb-2">
          <label className="form-label small text-muted">Дата народження</label>
          <input
            type="date"
            className={`form-control ${errors.birth ? "is-invalid" : ""}`}
            name="birth"
            value={form.birth}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.birth}</div>
        </div>

        <div className="mb-3">
          <select
            className={`form-control ${errors.source ? "is-invalid" : ""}`}
            name="source"
            value={form.source}
            onChange={handleChange}
          >
            <option value="">Звідки дізналися про нас?</option>
            <option value="Instagram">Instagram</option>
            <option value="Friends">Друзі</option>
            <option value="Ads">Реклама</option>
          </select>
          <div className="invalid-feedback">{errors.source}</div>
        </div>

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Реєстрація..." : "Зареєструватися"}
        </button>
      </form>
    </div>
  );
}
