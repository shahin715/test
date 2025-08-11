"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios"; 

export default function SalesReport() {
  const [filter, setFilter] = useState("daily");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
       
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/db.json?v=${Date.now()}`, { cache: "no-store" }); 
        const salesReport = await res.json();

        
        if (salesReport.salesReport[filter]) {
          const salesData = salesReport.salesReport[filter].map((item) => ({
            date: item.date,
            sales: item.value1,
            visits: item.value2,
          }));
          setData(salesData);
        } else {
          console.error(`Filter '${filter}' not found in the data.`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSalesData();
  }, [filter]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg w-full  mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white">📊 Sales Report</h2>
        <div className="flex gap-2">
          {["daily", "monthly", "yearly"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                filter === f
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-zinc-800 text-gray-400 border-zinc-700 hover:bg-zinc-700"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart scroll wrapper */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-zinc-800">
        <div className="min-w-[700px] sm:min-w-[750px] md:min-w-[800px] lg:min-w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #3f3f46",
                  color: "#fff",
                }}
                cursor={{ fill: "#333" }}
              />
              <Bar
                dataKey="sales"
                fill="#4C4EE7"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              />
              <Bar
                dataKey="visits"
                fill="#0EA5E9"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
