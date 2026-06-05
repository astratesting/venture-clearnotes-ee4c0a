"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ChevronRight, Search, Filter, Plus } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meetingDate: string;
  duration: number | null;
  status: string;
  _count: {
    actionItems: number;
  };
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.append("status", statusFilter.toUpperCase());

        const response = await fetch(`/api/meetings?${params}`);
        const data = await response.json();
        setMeetings(data.meetings || []);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [statusFilter]);

  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sand-900">Meetings</h1>
          <p className="text-sand-500 mt-1">
            Manage and review your meeting recordings
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 bg-white appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
        {filteredMeetings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sand-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-sand-400" />
            </div>
            <h3 className="text-lg font-semibold text-sand-900">
              {searchQuery ? "No meetings found" : "No meetings yet"}
            </h3>
            <p className="text-sand-500 mt-2 max-w-sm mx-auto">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Upload your first meeting recording to get started"}
            </p>
            {!searchQuery && (
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 bg-sky-blue-600 text-white rounded-lg font-medium hover:bg-sky-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Upload Recording
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-sand-100">
            {filteredMeetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/dashboard/meetings/${meeting.id}`}
                className="flex items-center gap-4 p-6 hover:bg-sand-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-sky-blue-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-sky-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-sand-900 truncate">
                    {meeting.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-sand-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatDate(meeting.meetingDate)}
                    </span>
                    {meeting.duration && (
                      <span>{formatDuration(meeting.duration)}</span>
                    )}
                    <span>
                      {meeting._count.actionItems} action item
                      {meeting._count.actionItems !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    meeting.status === "COMPLETED"
                      ? "bg-mint-100 text-mint-700"
                      : meeting.status === "PROCESSING"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-sand-100 text-sand-600"
                  }`}
                >
                  {meeting.status.toLowerCase()}
                </span>
                <ChevronRight className="w-5 h-5 text-sand-400" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
