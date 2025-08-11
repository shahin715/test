"use client";

import SalesReport from "../../components/salesReport/SalesReport"
import EarningAndClosedOrders from "../../components/earning/EarningStats"; 
import Order from "../../components/order/Order"

export default function DashboardCards() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full px-8 py-4 mx-auto">
      {/* Left: Sales Report */}
      <div className="lg:w-4/6 w-full">
        <SalesReport />
      </div>

      {/* Right: Earnings + Closed Orders */}
      <div className="lg:w-1/6 w-full">
        <EarningAndClosedOrders />
      </div>
        <div className="lg:w-1/6 w-full">
        <Order/>
      </div>
    </div>
  );
}

