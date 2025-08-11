import { useEffect, useState } from "react";
import { ArrowUp, Presentation, Users, Package, DollarSign } from "lucide-react";
import axios from "axios";

export default function SummaryCards() {
  const [summary, setSummary] = useState({
    sales: 0,
    customers: 0,
    products: 0,
    revenue: 0,
  });

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/db.json?v=${Date.now()}`, { cache: "no-store" })  
    .then((res) => res.json())
    .then((data) => setSummary(data.summary[0])) 
    .catch((err) => console.error("API fetch error", err));
}, []);

  const cards = [
    {
      title: "Sales",
      value: `${summary.sales}k`,
      growth: "4.3%",
      icon: <Presentation className="w-5 h-5 text-blue-400" />,
      iconBg: "bg-blue-900/20",
      valueColor: "text-blue-400",
    },
    {
      title: "Customers",
      value: `${summary.customers}k`,
      growth: "7.2%",
      icon: <Users className="w-5 h-5 text-yellow-400" />,
      iconBg: "bg-yellow-900/20",
      valueColor: "text-yellow-400",
    },
    {
      title: "Products",
      value: `${summary.products}k`,
      growth: "8%",
      icon: <Package className="w-5 h-5 text-green-400" />,
      iconBg: "bg-green-900/20",
      valueColor: "text-green-400",
    },
    {
      title: "Revenue",
      value: `$${summary.revenue}k`,
      growth: "3.69%",
      icon: <DollarSign className="w-5 h-5 text-pink-400" />,
      iconBg: "bg-pink-900/20",
      valueColor: "text-pink-400",
    },
  ];

  return (
    <div className="w-full px-7">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

function Card({ title, value, growth, icon, iconBg, valueColor }) {
  return (
    <div className="bg-zinc-900 rounded-xl shadow border border-zinc-700 flex flex-col justify-between h-full p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400 text-base md:text-lg font-medium">{title}</h3>
        <div className={`${iconBg} p-2 rounded-md`}>
          {icon}
        </div>
      </div>

      <div className={`${valueColor} text-2xl md:text-3xl font-bold mb-2`}>
        {value}
      </div>

      <div className="flex items-center text-green-500 text-sm">
        <ArrowUp className="w-4 h-4 mr-1" />
        <span>{growth}</span>
      </div>
    </div>
  );
}
