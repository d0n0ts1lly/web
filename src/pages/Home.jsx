import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addImportedEvents } from "../store/eventsSlice";
import { toast } from "react-toastify";
import EventList from "../components/EventList";
import Pagination from "../components/Pagination";

const PER_PAGE = 6;

export default function Home() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.list);

  const totalPages = Math.ceil(events.length / PER_PAGE);
  const visible = events.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleImport = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=4"
      );

      if (!response.ok) throw new Error("Помилка мережі");

      const data = await response.json();

      const mappedEvents = data.map((item) => ({
        id: Date.now() + item.id,
        title: `Global: ${item.title.substring(0, 15)}`,
        description: item.body,
        eventDate: new Date().toISOString().split("T")[0],
        organizer: "External System",
      }));

      dispatch(addImportedEvents(mappedEvents));
      toast.success(`Імпортовано ${mappedEvents.length} нових подій!`);

      setPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося завантажити дані");
    }
  };

  return (
    <div className="pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Події</h2>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleImport}
        >
          Імпортувати API
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
          <p className="text-muted">Подій поки немає. Спробуйте імпортувати.</p>
        </div>
      )}
    </div>
  );
}
