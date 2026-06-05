"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Upload,
  CheckSquare,
  Settings,
  LogOut,
  Mic2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Meetings",
    href: "/dashboard/meetings",
    icon: Calendar,
  },
  {
    name: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    name: "Action Items",
    href: "/dashboard/action-items",
    icon: CheckSquare,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-sand-200 w-64 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sand-200">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-blue-500 to-sky-blue-600 flex items-center justify-center">
          <Mic2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-semibold text-sand-900">ClearNotes</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sky-blue-50 text-sky-blue-700"
                  : "text-sand-600 hover:bg-sand-100 hover:text-sand-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-sky-blue-600" : "text-sand-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sand-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-blue-400 to-sky-blue-500 flex items-center justify-center text-white font-medium text-sm">
            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sand-900 truncate">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs text-sand-500 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-sand-600 hover:text-sand-900 hover:bg-sand-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
