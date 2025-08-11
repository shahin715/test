"use client";

import { Instagram, Facebook, Twitter, Youtube, Video, Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";


const ICON_MAP = {
  Instagram: <Instagram className="text-pink-500 w-5 h-5" />,
  Facebook: <Facebook className="text-blue-500 w-5 h-5" />,
  Twitter: <Twitter className="text-blue-400 w-5 h-5" />,
  Youtube: <Youtube className="text-red-600 w-5 h-5" />,
  Tiktok: <Video className="text-white w-5 h-5" />,
  Pinterest: <Heart className="text-red-400 w-5 h-5" />,
  Discord: <MessageCircle className="text-indigo-400 w-5 h-5" />,
};

export default function SocialAnalytics() {
  const [socialItems, setSocialItems] = useState([]);
  const [countryItems, setCountryItems] = useState([]);

  useEffect(() => {
   
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/db.json?v=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setSocialItems(data.socialItems); 
        setCountryItems(data.countryItems);
      })
      .catch((err) => console.error("Failed to fetch data from db.json:", err));
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full h-full bg-zinc-900 border border-zinc-700 p-6 rounded-lg text-white">
      {/* Social Source Section */}
      <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Social Source</h2>
          <span className="text-sm text-gray-400">•••</span>
        </div>
        <div className="text-3xl font-bold mb-1">
          135K{" "}
          <span className="text-green-400 text-base font-medium">+3.1%</span>
        </div>
        <div className="text-sm text-gray-400 mb-4">View in this month</div>

        <ul className="space-y-3">
          {socialItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {ICON_MAP[item.icon] || <Video className="text-white w-5 h-5" />}
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-6 text-gray-300">
                <span>{item.views}</span>
                <span>{item.revenue}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Country Source Section */}
      <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Country Source</h2>
          <a href="#" className="text-sm text-blue-400 hover:underline">
            View All
          </a>
        </div>
        <div className="text-xl font-bold mb-1">
          93 <span className="text-green-400 text-sm font-medium">+1.3%</span>
        </div>
        <div className="text-sm text-gray-400 mb-4">
          Country in this month
        </div>

        <div className="flex flex-wrap gap-4">
          {countryItems.map((country) => (
            <div
              key={country.id}
              className="bg-zinc-700 px-4 py-2 rounded-lg flex items-center gap-3 text-sm"
            >
              <div className="w-6 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-sm flex items-center justify-center text-xs font-bold text-white">
                {country.code}
              </div>
              <span className="font-medium">{country.name}</span>
              {country.green && (
                <div className="flex items-center gap-2">
                  <span className="text-green-400">{country.green}</span>
                  <span className="text-orange-400">{country.orange}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
