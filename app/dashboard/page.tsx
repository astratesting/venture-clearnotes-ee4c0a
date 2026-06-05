"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  ArrowRight,
  Plus,
} from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";

interface Meeting {
  id: string;
  title: string;
  meetingDate: string;
  duration: number | null;
  status: string;
  _count: {
    actionItems: number;
  };
}

interface ActionItem {
  id: string;
  content: string;
  priority: string;
  status: string;
  meeting: {
    title: string;
  };
}

interface DashboardStats {
  totalMeetings: number;
  totalDuration: number;
  pendingActionItems: number;
  completedActionItems: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalMeetings: 0,
    totalDuration: 0,
    pendingActionItems: 0,
    completedActionItems: 0,
  });
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [recentActionItems, setRecentActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [meetingsRes, actionItemsRes] = await Promise.all([
          fetch("/api/meetings?limit=5"),
          fetch("/api/action-items?limit=5"),
        ]);

        const meetingsData = await meetingsRes.json();
        const actionItemsData = await actionItemsRes.json();

        setRecentMeetings(meetingsData.meetings || []);
        setRecentActionItems(actionItemsData.actionItems || []);

        // Calculate stats
        const totalDuration = meetingsData.meetings?.reduce(
          (acc: number, m: Meeting) => acc + (m.duration || 0),
          0
        ) || 0;

        const pending = actionItemsData.actionItems?.filter(
          (item: ActionItem) => item.status === "PENDING"
        ).length || 0;

        const completed = actionItemsData.actionItems?.filter(
          (item: ActionItem) => item.status === "COMPLETED"
        ).length || 0;

        setStats({
          totalMeetings: meetingsData.total || 0,
          totalDuration,
          pendingActionItems: pending,
          completedActionItems: completed,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sand-900">
            Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-sand-500 mt-1">
            Here&apos;s what&apos;s happening with your meetings
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-blue-600 text-white rounded-lg font-medium hover:bg-sky-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Upload Recording
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-sand-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-sky-blue-50">
              <Calendar className="w-5 h-5 text-sky-blue-600" />
            </div>
            <div>
              <p className="text-sm text-sand-500">Total Meetings</p>
              <p className="text-2xl font-bold text-sand-900">{stats.totalMeetings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sand-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-mint-50">
              <Clock className="w-5 h-5 text-mint-600" />
            </div>
            <div>
              <p className="text-sm text-sand-500">Hours Processed</p>
              <p className="text-2xl font-bold text-sand-900">
                {Math.round(stats.totalDuration / 60 * 10) / 10}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sand-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-50">
              <CheckSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-sand-500">Pending Tasks</p>
              <p className="text-2xl font-bold text-sand-900">{stats.pendingActionItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sand-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-50">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-sand-500">Completed</p>
              <p className="text-2xl font-bold text-sand-900">{stats.completedActionItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Meetings */}
        <div className="bg-white rounded-xl border border-sand-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200">
            <h2 className="text-lg font-semibold text-sand-900">Recent Meetings</h2>
            <Link
              href="/dashboard/meetings"
              className="text-sm text-sky-blue-600 hover:text-sky-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-sand-100">
            {recentMeetings.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-sand-500 text-sm">No meetings yet</p>
                <Link
                  href="/dashboard/upload"
                  className="inline-flex items-center gap-1 text-sky-blue-600 hover:text-sky-blue-700 text-sm font-medium mt-2"
                >
                  Upload your first meeting
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              recentMeetings.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/dashboard/meetings/${meeting.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-sand-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-sand-900 truncate">
                      {meeting.title}
                    </h3>
                    <p className="text-xs text-sand-500 mt-0.5">
                      {formatDate(meeting.meetingDate)} ·{" "}
                      {meeting.duration ? formatDuration(meeting.duration) : "Unknown duration"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        meeting.status === "COMPLETED"
                          ? "bg-mint-100 text-mint-700"
                          : meeting.status === "PROCESSING"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-sand-100 text-sand-600"
                      }`}
                    >
                      {meeting.status.toLowerCase()}
                    </span>
                    <span className="text-xs text-sand-500">
                      {meeting._count?.actionItems || 0} tasks
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl border border-sand-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200">
            <h2 className="text-lg font-semibold text-sand-900">Action Items</h2>
            <Link
              href="/dashboard/action-items"
              className="text-sm text-sky-blue-600 hover:text-sky-blue-700 font-medium flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-sand-100">
            {recentActionItems.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-sand-500 text-sm">No action items yet</p>
                <p className="text-sand-400 text-xs mt-1">
                  Upload a meeting to extract action items
                </p>
              </div>
            ) : (
              recentActionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-6 py-4 hover:bg-sand-50 transition-colors"
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 cursor-pointer transition-colors ${
                      item.status === "COMPLETED"
                        ? "bg-mint-500 border-mint-500"
                        : "border-sand-300 hover:border-sky-blue-500"
                    }`}
                  >
                    {item.status === "COMPLETED" && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${item.status === "COMPLETED" ? "text-sand-400 line-through" : "text-sand-900"}`}>
                      {item.content}
                    </p>
                    <p className="text-xs text-sand-500 mt-0.5">{item.meeting.title}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                      item.priority === "URGENT"
                        ? "bg-red-100 text-red-700"
                        : item.priority === "HIGH"
                        ? "bg-amber-100 text-amber-700"
                        : item.priority === "MEDIUM"
                        ? "bg-sky-blue-100 text-sky-blue-700"
                        : "bg-sand-100 text-sand-600"
                    }`}
                  >
                    {item.priority.toLowerCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
