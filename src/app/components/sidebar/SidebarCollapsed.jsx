"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  LayoutGrid,
  AlignJustify,
  Users,
  Lightbulb,
  Settings,
} from "lucide-react";

function SidebarIcon({ icon: Icon, label, href, isActive }) {
  const iconColorClass = isActive
    ? "text-blue-400"
    : "text-gray-400 group-hover:text-gray-200";
  const bgColorClass = isActive ? "bg-[#1E293B]" : "group-hover:bg-gray-800";

  return (
    <Link href={href} className="group relative w-12 h-12">
      <div
        className={`flex items-center justify-center w-full h-full rounded-lg transition-colors duration-200 cursor-pointer ${bgColorClass}`}
      >
        <Icon className={`w-6 h-6 ${iconColorClass}`} />
      </div>
      <span className="absolute left-14 z-10 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {label}
      </span>
    </Link>
  );
}

export default function SidebarCollapsed() {
  const pathname = usePathname();

  return (
    <aside
      className={`
        hidden lg:flex fixed lg:static
        top-0 left-0 z-50 w-20 h-screen
        flex-col items-center py-4
        bg-zinc-900 border-r border-zinc-800
      `}
    >
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center space-y-6 flex-grow">
        <SidebarIcon icon={Home} label="Home" href="/" isActive={pathname === "/"} />
        <SidebarIcon icon={Package} label="Products" href="/productMangement" isActive={pathname === "/productMangement"} />
        <SidebarIcon icon={LayoutGrid} label="Dashboard" href="/notFound" isActive={pathname === "/notFound"} />
        <SidebarIcon icon={AlignJustify} label="Menu" href="/notFound" isActive={pathname === "/notFound"} />
        <SidebarIcon icon={Users} label="Users" href="/notFound" isActive={pathname === "/notFound"} />
        <SidebarIcon icon={Lightbulb} label="Ideas" href="/notFound" isActive={pathname === "/notFound"} />
      </nav>

      {/* Bottom section */}
      <div className="flex flex-col items-center space-y-6 mt-auto mb-2">
        <SidebarIcon icon={Settings} label="Settings" href="/notFound" isActive={pathname === "/notFound"} />
        <div className="relative">
          <img
            src="/user.png"
            alt="User Avatar"
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></span>
        </div>
      </div>
    </aside>
  );
}
