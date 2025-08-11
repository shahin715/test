"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function OrderStats({
  cardWidth = "w-full",
  rating = 85,
  orders = "22.6k",
  ratingCardHeight = "h-full",
  ordersCardHeight = "h-[240px]",
}) {
  const isCompact = ratingCardHeight === "h-[150px]" || ratingCardHeight === "h-[100px]";

  return (
    <div className={`flex flex-col gap-4 ${cardWidth}`}>
      {/* Current Rating Card */}
      <Card
        className={`bg-zinc-900 border-zinc-700 text-white shadow-md ${ratingCardHeight} ${
          isCompact ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <CardContent className={`flex items-center gap-4 ${isCompact ? "p-2" : "p-4"} h-full`}>
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
                className="text-green-400"
                strokeDasharray={`${rating}, 100`}
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
                {rating}%
              </text>
            </svg>
          </div>
          <div className="flex-shrink">
            <p className={`${isCompact ? "text-xs" : "text-sm"} text-gray-400`}>
              Current Rating
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Orders Card */}
      <Card
        className={`bg-zinc-900 border-zinc-700 text-white shadow-md ${ordersCardHeight} ${
          isCompact ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <CardHeader className={`${isCompact ? "px-4 pt-2 pb-1" : "px-4 pt-4 pb-2"}`}>
          <CardTitle className={`${isCompact ? "text-xs" : "text-sm"} text-gray-400`}>
            Orders
          </CardTitle>
          <div className={`${isCompact ? "text-base" : "text-xl"} font-semibold text-white`}>
            {orders}
          </div>
        </CardHeader>
        <CardContent className="p-0 px-4 pb-4">
          <svg
            viewBox="0 0 100 80"
            preserveAspectRatio="none"
            className={`${isCompact ? "h-12" : "h-16"} w-full`}
          >
            <path
              d="M0 80 C 20 40, 40 90, 60 50 S 80 10, 100 60"
              stroke="#facc15"
              strokeWidth="3"
              fill="none"
            />
            <defs>
              <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 80 C 20 40, 40 90, 60 50 S 80 10, 100 60 L 100 80 Z"
              fill="url(#fade)"
            />
          </svg>
        </CardContent>
      </Card>
    </div>
  );
}

