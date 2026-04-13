import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("${API_URL}/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка входу");
      }

      dispatch(
        setCredentials({
          user: data.user,
          isAuthenticated: true,
        })
      );

      toast.success("Ви успішно увійшли!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Вхід для організаторів</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Логін</label>
          <input
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Пароль</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Вхід...
            </>
          ) : (
            "Увійти"
          )}
        </button>
      </form>
    </div>
  );
}
