"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function EarningAndClosedOrders({
  cardWidth = "w-full",
  earningCardHeight = "h-full",
  closedOrderCardHeight = "h-[122px]",
  earningValue = "16.4k",
  closedOrderPercent = 45,
}) {
  const isCompact =
    earningCardHeight === "h-[150px]" || earningCardHeight === "h-[100px]";
  const bars = [70, 65, 60, 30, 55]; // bar heights in %

  return (
    <div className={`flex flex-col gap-4 w-full max-w-xl mx-auto`}>
      {/* Earning Card */}
      <Card
        className={`bg-zinc-900 border border-zinc-700 text-white shadow-sm rounded-xl ${earningCardHeight} ${
          isCompact ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <CardHeader
          className={`px-4 ${isCompact ? "pt-2 pb-1" : "pt-4 pb-2"} overflow-hidden`}
        >
          <CardTitle
            className={`${isCompact ? "text-xs" : "text-sm"} text-gray-400`}
          >
            Earning
          </CardTitle>
          <div
            className={`${isCompact ? "text-base" : "text-xl"} font-semibold text-white`}
          >
            ${earningValue}
          </div>
        </CardHeader>

        <CardContent className={`p-4 pt-0 ${isCompact ? "pb-1" : "pb-4"}`}>
          <div
            className={`flex items-end justify-between ${isCompact ? "h-12" : "h-20"}`}
          >
            {bars.map((height, i) => (
              <div key={i} className="w-3 h-full flex flex-col justify-end">
                <div
                  className="w-full bg-white rounded-t-sm"
                  style={{ height: `${height}%` }}
                />
                <div
                  className="w-full bg-blue-400 rounded-b-sm"
                  style={{ height: `${100 - height}%` }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Closed Orders Card */}
      <Card
        className={`bg-zinc-900 border border-zinc-700 text-white shadow-sm rounded-xl ${closedOrderCardHeight} ${
          isCompact ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <CardContent
          className={`flex items-center gap-4 ${isCompact ? "p-2" : "p-4"} h-full`}
        >
          <div className={`relative ${isCompact ? "w-8 h-8" : "w-12 h-12"}`}>
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                className="text-gray-700"
                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="text-blue-500"
                strokeDasharray={`${closedOrderPercent}, 100`}
                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <text
                x="18"
                y="20.35"
                className={`${isCompact ? "text-[8px]" : "text-xs"} fill-white`}
                textAnchor="middle"
              >
                {closedOrderPercent}%
              </text>
            </svg>
          </div>
          <div className="flex-shrink">
            <p className={`${isCompact ? "text-xs" : "text-sm"} text-gray-400`}>
              Closed Orders
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


