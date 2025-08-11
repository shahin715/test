"use client";
import DashboardLayout from "./DashboardLayout";
import ProductTable from "./components/productTable/ProductTable";
import SalesSummary from "./components/salesSummary/SalesSummary";


import ActivityDashboard from "./components/activityDashboard/ActivityDashboard";


import SummaryCards from "./components/summaryCards/SummaryCards";
export default function HomePage() {
  return (
    <div className="">
      <DashboardLayout>
      <div className="">
<SummaryCards/>

     
    <SalesSummary/>
     <ProductTable/>
   
     
     <ActivityDashboard/>
      </div>
     
  
       
    </DashboardLayout>
    </div>
  );
}


