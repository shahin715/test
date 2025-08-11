"use client";

import { useEffect, useState } from "react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
   
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/db.json?v=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions)) 
      .catch((err) => console.error("Failed to fetch:", err));
  }, []);

  return (
    <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-md w-full max-w-full border border-zinc-700 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <a href="#" className="text-sm text-blue-400 hover:underline">View All</a>
        </div>

        <ul className="space-y-4">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className="flex justify-between items-center bg-zinc-800 px-4 py-3 rounded-md"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${tx.color} text-sm font-semibold`}>
                  {tx.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium">{tx.name}</div>
                  <div className="text-xs text-gray-400">{tx.date}</div>
                </div>
              </div>
              <div className={`text-sm font-semibold ${tx.amount >= 0 ? "text-green-400" : "text-red-500"}`}>
                ${tx.amount.toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
