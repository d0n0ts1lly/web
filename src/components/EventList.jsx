import EventCard from "./EventCard";

export default function EventList({ events }) {
  return (
    <div className="row g-3">
      {events.map((e) => (
        <EventCard key={e.id} {...e} />
      ))}
    </div>
  );
}
