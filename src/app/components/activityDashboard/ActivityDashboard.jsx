import TeamActivity from "./TeamActivity";
import Transactions from "./Transactions";
import SocialAnalytics from "./SocialAnalytics";

export default function ActivityDashboard() {
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4 px-8 pt-4 text-white rounded-lg items-stretch">
      <div className="w-full md:w-1/3">
        <TeamActivity />
      </div>
      <div className="w-full md:w-1/3">
        <SocialAnalytics />
      </div>
      <div className="w-full md:w-1/3">
        <Transactions />
      </div>
    </div>
  );
}
