"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckSquare,
  FileText,
  Share2,
  Download,
  MoreVertical,
} from "lucide-react";
import { formatDate, formatDuration, formatDateTime } from "@/lib/utils";

interface ActionItem {
  id: string;
  content: string;
  assignee: string | null;
  deadline: string | null;
  priority: string;
  status: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meetingDate: string;
  duration: number | null;
  status: string;
  transcription: string | null;
  summary: string | null;
  audioUrl: string | null;
  actionItems: ActionItem[];
  createdAt: string;
}

export default function MeetingDetailPage() {
  const params = useParams();
  const meetingId = params.id as string;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "transcription">("summary");

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/meetings/${meetingId}`);
        const data = await response.json();
        setMeeting(data);
      } catch (error) {
        console.error("Error fetching meeting:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  const handleActionItemToggle = async (actionItemId: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      await fetch(`/api/action-items/${actionItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      // Refresh meeting data
      const response = await fetch(`/api/meetings/${meetingId}`);
      const data = await response.json();
      setMeeting(data);
    } catch (error) {
      console.error("Error updating action item:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <p className="text-sand-500">Meeting not found</p>
        <Link
          href="/dashboard/meetings"
          className="text-sky-blue-600 hover:text-sky-blue-700 font-medium mt-2 inline-block"
        >
          Back to meetings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/meetings"
          className="inline-flex items-center gap-1 text-sand-500 hover:text-sand-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to meetings
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-sand-900">{meeting.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-sand-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDateTime(meeting.meetingDate)}
              </span>
              {meeting.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDuration(meeting.duration)}
                </span>
              )}
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  meeting.status === "COMPLETED"
                    ? "bg-mint-100 text-mint-700"
                    : meeting.status === "PROCESSING"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-sand-100 text-sand-600"
                }`}
              >
                {meeting.status.toLowerCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-sand-500 hover:text-sand-700 hover:bg-sand-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            {meeting.audioUrl && (
              <button className="p-2 text-sand-500 hover:text-sand-700 hover:bg-sand-100 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 text-sand-500 hover:text-sand-700 hover:bg-sand-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Summary & Transcription */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-sand-200">
            <div className="flex border-b border-sand-200">
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === "summary"
                    ? "text-sky-blue-600 border-b-2 border-sky-blue-600"
                    : "text-sand-500 hover:text-sand-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Summary
                </span>
              </button>
              <button
                onClick={() => setActiveTab("transcription")}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === "transcription"
                    ? "text-sky-blue-600 border-b-2 border-sky-blue-600"
                    : "text-sand-500 hover:text-sand-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Transcription
                </span>
              </button>
            </div>
            <div className="p-6">
              {meeting.status === "PENDING" && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-sand-900 font-medium">Processing...</p>
                  <p className="text-sand-500 text-sm mt-1">
                    Your meeting is being transcribed and analyzed
                  </p>
                </div>
              )}
              {meeting.status === "PROCESSING" && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sky-blue-100 flex items-center justify-center animate-pulse">
                    <Clock className="w-6 h-6 text-sky-blue-600" />
                  </div>
                  <p className="text-sand-900 font-medium">
                    Almost done!
                  </p>
                  <p className="text-sand-500 text-sm mt-1">
                    Finishing up the analysis
                  </p>
                </div>
              )}
              {activeTab === "summary" ? (
                meeting.summary ? (
                  <div className="prose prose-sand max-w-none">
                    <h3 className="text-lg font-semibold text-sand-900 mb-3">Meeting Summary</h3>
                    <p className="text-sand-700 whitespace-pre-wrap">{meeting.summary}</p>
                  </div>
                ) : (
                  meeting.status === "COMPLETED" && (
                    <div className="text-center py-8 text-sand-500">
                      No summary available
                    </div>
                  )
                )
              ) : (
                meeting.transcription ? (
                  <div className="prose prose-sand max-w-none">
                    <h3 className="text-lg font-semibold text-sand-900 mb-3">Full Transcription</h3>
                    <div className="text-sand-700 whitespace-pre-wrap leading-relaxed text-sm" style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {meeting.transcription}
                    </div>
                  </div>
                ) : (
                  meeting.status === "COMPLETED" && (
                    <div className="text-center py-8 text-sand-500">
                      No transcription available
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Action Items */}
        <div className="bg-white rounded-xl border border-sand-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-sand-400" />
              <h2 className="text-lg font-semibold text-sand-900">Action Items</h2>
            </div>
            <span className="text-sm text-sand-500">
              {meeting.actionItems.length}
            </span>
          </div>
          <div className="divide-y divide-sand-100">
            {meeting.actionItems.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sand-500 text-sm">No action items found</p>
                <p className="text-sand-400 text-xs mt-1">
                  {meeting.status === "PENDING" || meeting.status === "PROCESSING"
                    ? "They will appear once processing is complete"
                    : "No action items were detected in this meeting"}
                </p>
              </div>
            ) : (
              meeting.actionItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-sand-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleActionItemToggle(item.id, item.status)}
                      className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        item.status === "COMPLETED"
                          ? "bg-mint-500 border-mint-500"
                          : item.priority === "HIGH"
                          ? "border-red-400 hover:border-red-500"
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
                      <p className={`text-sm ${item.status === "COMPLETED" ? "text-sand-400 line-through" : "text-sand-900"}`}>
                        {item.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {item.assignee && (
                          <span className="text-xs text-sand-500">@{item.assignee}</span>
                        )}
                        {item.deadline && (
                          <span className={`text-xs ${
                            new Date(item.deadline) < new Date() && item.status !== "COMPLETED"
                              ? "text-red-500"
                              : "text-sand-500"
                          }`}>
                            Due {formatDate(item.deadline)}
                          </span>
                        )}
                      </div>
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
