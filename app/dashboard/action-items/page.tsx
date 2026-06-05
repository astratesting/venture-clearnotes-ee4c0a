"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Filter, Search, ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ActionItem {
  id: string;
  content: string;
  assignee: string | null;
  deadline: string | null;
  priority: string;
  status: string;
  createdAt: string;
  meeting: {
    title: string;
    id: string;
  };
}

export default function ActionItemsPage() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    const fetchActionItems = async () => {
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.append("status", statusFilter.toUpperCase());
        if (priorityFilter !== "all") params.append("priority", priorityFilter.toUpperCase());

        const response = await fetch(`/api/action-items?${params}`);
        const data = await response.json();
        setActionItems(data.actionItems || []);
      } catch (error) {
        console.error("Error fetching action items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActionItems();
  }, [statusFilter, priorityFilter]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      await fetch(`/api/action-items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setActionItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating action item:", error);
    }
  };

  const filteredItems = actionItems.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.assignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: actionItems.length,
    pending: actionItems.filter((i) => i.status === "PENDING").length,
    completed: actionItems.filter((i) => i.status === "COMPLETED").length,
    overdue: actionItems.filter(
      (i) =>
        i.deadline &&
        new Date(i.deadline) < new Date() &&
        i.status !== "COMPLETED"
    ).length,
  };

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
      <div>
        <h1 className="text-2xl font-bold text-sand-900">Action Items</h1>
        <p className="text-sand-500 mt-1">
          Track and manage action items from all your meetings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-sand-200 p-4">
          <p className="text-sm text-sand-500">Total</p>
          <p className="text-2xl font-bold text-sand-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-sand-200 p-4">
          <p className="text-sm text-sand-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-sand-200 p-4">
          <p className="text-sm text-sand-500">Completed</p>
          <p className="text-2xl font-bold text-mint-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl border border-sand-200 p-4">
          <p className="text-sm text-sand-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
          <input
            type="text"
            placeholder="Search action items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Items List */}
      <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sand-100 flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-sand-400" />
            </div>
            <h3 className="text-lg font-semibold text-sand-900">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "No action items found"
                : "No action items yet"}
            </h3>
            <p className="text-sand-500 mt-2 max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Upload a meeting to extract action items"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-sand-100">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-6 hover:bg-sand-50 transition-colors"
              >
                <button
                  onClick={() => handleToggleStatus(item.id, item.status)}
                  className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-colors ${
                    item.status === "COMPLETED"
                      ? "bg-mint-500 border-mint-500"
                      : "border-sand-300 hover:border-sky-blue-500"
                  }`}
                >
                  {item.status === "COMPLETED" && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sand-900 ${item.status === "COMPLETED" ? "line-through text-sand-400" : ""}`}>
                    {item.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
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
                    <Link
                      href={`/dashboard/meetings/${item.meeting.id}`}
                      className="text-xs text-sand-500 hover:text-sky-blue-600 flex items-center gap-1"
                    >
                      {item.meeting.title}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    {(item.assignee || item.deadline) && (
                      <span className="text-xs text-sand-400 flex items-center gap-1">
                        {item.assignee && `@${item.assignee}`}
                        {item.assignee && item.deadline && " · "}
                        {item.deadline && (
                          <span
                            className={
                              new Date(item.deadline) < new Date() && item.status !== "COMPLETED"
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {formatDate(item.deadline)}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
