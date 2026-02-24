import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const data = useMemo(() => {
    const allEventsData =
      JSON.parse(localStorage.getItem("event_participants")) || {};
    const allParticipants = Object.values(allEventsData).flat();

    const counts = allParticipants.reduce((acc, p) => {
      const date = p.registrationDate || "Невідомо";
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  return (
    <div className="card p-4 shadow-sm">
      <h3>Аналітика реєстрацій</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
