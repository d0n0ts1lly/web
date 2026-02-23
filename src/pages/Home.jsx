import { useState } from "react";
import { useSelector } from "react-redux";
import EventList from "../components/EventList";
import Pagination from "../components/Pagination";

const PER_PAGE = 6;

export default function Home() {
  const [page, setPage] = useState(1);

  const events = useSelector((state) => state.events.list);

  const totalPages = Math.ceil(events.length / PER_PAGE);

  const visible = events.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <h2>Події</h2>
      <EventList events={visible} />
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </>
  );
}
