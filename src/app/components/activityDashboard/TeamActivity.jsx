"use client";

const activities = [
  {
    title: "User Photo Changed",
    time: "21 minutes ago",
    description: "John Doe changed his avatar photo",
    color: "bg-gray-400",
  },
  {
    title: "Video Added",
    time: "2 hours ago",
    description: "Mores Clarke added new video",
    color: "bg-blue-500",
  },
  {
    title: "Design Completed",
    time: "3 hours ago",
    description: "Robert Nolan completed the design of the CRM application",
    color: "bg-green-500",
  },
  {
    title: "ER Diagram",
    time: "a day ago",
    description: "Team completed the ER diagram app",
    color: "bg-yellow-400",
  },
  {
    title: "Weekly Report",
    time: "2 days ago",
    description: "The weekly report was uploaded",
    color: "bg-red-500",
  },
];

export default function TeamActivity() {
  return (
    <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-md w-full max-w-full border border-zinc-700 h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Team Activity</h2>
          <a href="#" className="text-sm text-blue-400 hover:underline">View All</a>
        </div>

        <ul className="space-y-6">
          {activities.map((item, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className={`w-3 h-3 mt-1 rounded-full ${item.color}`}></div>
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="text-xs text-gray-400">{item.time}</div>
                <div className="text-sm text-gray-300">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
