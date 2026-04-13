import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addImportedEvents } from "../store/eventsSlice";
import { toast } from "react-toastify";
import EventList from "../components/EventList";
import Pagination from "../components/Pagination";

const PER_PAGE = 6;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Home() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.list);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) throw new Error("Помилка завантаження");
        const data = await response.json();

        const normalizedData = data.map((ev) => ({
          ...ev,
          eventDate: ev.date,
        }));

        dispatch(addImportedEvents(normalizedData));
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    loadEvents();
  }, [dispatch]);

  const totalPages = Math.ceil(events.length / PER_PAGE);
  const visible = events.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleImport = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events`);

      if (!response.ok) throw new Error("Помилка мережі");

      const data = await response.json();

      const mappedEvents = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        eventDate: item.date,
        organizer: item.organizer,
      }));

      dispatch(addImportedEvents(mappedEvents));
      toast.success(`Оновлено! База даних синхронізована.`);
      setPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося синхронізувати дані");
    }
  };

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Події</h2>
        <button
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={handleImport}
        >
          🔄 Оновити список
        </button>
      </div>

      {events.length > 0 ? (
        <>
          <EventList events={visible} />
          <div className="mt-4">
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </>
      ) : (
        <div className="text-center mt-5">
          <p className="text-muted">Подій у базі поки немає.</p>
        </div>
      )}
    </div>
  );
}
