import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center mt-5">
      <h1>404</h1>
      <h3>Сторінку не знайдено</h3>
      <Link to="/" className="btn btn-primary mt-3">
        Повернутися на головну
      </Link>
    </div>
  );
}
