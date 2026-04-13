import React, { useState, useEffect } from "react";
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/analytics/registrations"
        );
        if (!response.ok) throw new Error("Помилка завантаження статистики");
        const result = await response.json();

        const formattedData = result.map((item) => ({
          date: new Date(item.date).toLocaleDateString(),
          count: item.count,
        }));

        setData(formattedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <div className="text-center p-5">
        <div className="spinner-border" />
      </div>
    );

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-4">Аналітика реєстрацій (динаміка)</h3>
      <div style={{ width: "100%", height: 350 }}>
        {data.length > 0 ? (
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Кількість реєстрацій"
                stroke="#0d6efd"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted pt-5">
            Дані для аналітики відсутні
          </div>
        )}
      </div>
    </div>
  );
}
