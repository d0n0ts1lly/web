import { useState } from "react";
import data from "./data/events.json";
import Header from "./components/Header";
import EventList from "./components/EventList";
import Pagination from "./components/Pagination";

export default function App() {
  const [events] = useState(data);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 6;

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container mt-4">
      <Header search={search} setSearch={setSearch} />
      <EventList events={shown} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
