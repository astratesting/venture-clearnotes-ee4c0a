"use client";

import { useEffect, useState } from "react";
import { Bell, Calendar, Mail, User, Loader2, CheckCircle } from "lucide-react";

interface UserSettings {
  emailNotifications: boolean;
  dailyDigest: boolean;
  autoJoinCalendarEvents: boolean;
  preferredAiModel: string;
  emailSignature: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-sand-900">Settings</h1>
        <p className="text-sand-500 mt-1">
          Manage your preferences and integrations
        </p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-sand-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-sky-blue-50">
            <Bell className="w-5 h-5 text-sky-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sand-900">Notifications</h2>
            <p className="text-sm text-sand-500">Control how you receive updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-sand-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-sand-900">Email Notifications</p>
              <p className="text-sm text-sand-500">Get notified when meetings are processed</p>
            </div>
            <input
              type="checkbox"
              checked={settings?.emailNotifications}
              onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
              className="h-5 w-5 text-sky-blue-600 focus:ring-sky-blue-500 border-sand-300 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-sand-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-sand-900">Daily Digest</p>
              <p className="text-sm text-sand-500">Receive a daily summary of action items</p>
            </div>
            <input
              type="checkbox"
              checked={settings?.dailyDigest}
              onChange={(e) => updateSetting("dailyDigest", e.target.checked)}
              className="h-5 w-5 text-sky-blue-600 focus:ring-sky-blue-500 border-sand-300 rounded"
            />
          </label>
        </div>
      </div>

      {/* Calendar Integration */}
      <div className="bg-white rounded-xl border border-sand-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-mint-50">
            <Calendar className="w-5 h-5 text-mint-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sand-900">Calendar Integration</h2>
            <p className="text-sm text-sand-500">Connect your calendar for automatic meeting tracking</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-sand-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-sand-900">Auto-join Calendar Events</p>
              <p className="text-sm text-sand-500">
                Join Google/Zoom meetings from connected calendars
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings?.autoJoinCalendarEvents}
              onChange={(e) => updateSetting("autoJoinCalendarEvents", e.target.checked)}
              className="h-5 w-5 text-sky-blue-600 focus:ring-sky-blue-500 border-sand-300 rounded"
            />
          </label>

          <div className="p-4 bg-sand-50 rounded-lg">
            <p className="text-sm text-sand-600 mb-3">Connected Calendars</p>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-white border border-sand-200 rounded-lg hover:border-sky-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-sand-900">Google Calendar</span>
                </div>
                <span className="text-xs text-sand-500">Connect</span>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white border border-sand-200 rounded-lg hover:border-sky-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-800" />
                  </div>
                  <span className="text-sm font-medium text-sand-900">Outlook</span>
                </div>
                <span className="text-xs text-sand-500">Connect</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white rounded-xl border border-sand-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-50">
            <User className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sand-900">AI Preferences</h2>
            <p className="text-sm text-sand-500">Customize how ClearNotes processes your meetings</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-sand-50 rounded-lg">
            <label className="block text-sm font-medium text-sand-700 mb-2">
              Preferred AI Model
            </label>
            <select
              value={settings?.preferredAiModel}
              onChange={(e) => updateSetting("preferredAiModel", e.target.value)}
              className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 bg-white"
            >
              <option value="gpt-4">GPT-4 (Best Quality)</option>
              <option value="gpt-4o">GPT-4o (Balanced)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fastest)</option>
            </select>
            <p className="text-xs text-sand-500 mt-2">
              GPT-4 provides the highest quality summaries and action item extraction.
            </p>
          </div>

          <div className="p-4 bg-sand-50 rounded-lg">
            <label className="block text-sm font-medium text-sand-700 mb-2">
              Email Signature for Action Items
            </label>
            <textarea
              value={settings?.emailSignature || ""}
              onChange={(e) => updateSetting("emailSignature", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 resize-none"
              placeholder="Best regards,&#10;Sent via ClearNotes"
            />
            <p className="text-xs text-sand-500 mt-2">
              This signature will be added to action item emails sent to participants.
            </p>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl border border-sand-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-50">
            <Mail className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sand-900">Integrations</h2>
            <p className="text-sm text-sand-500">Connect with your favorite tools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "Slack", icon: "S", color: "bg-purple-500" },
            { name: "Notion", icon: "N", color: "bg-sand-900" },
            { name: "Asana", icon: "A", color: "bg-rose-500" },
            { name: "Trello", icon: "T", color: "bg-blue-500" },
            { name: "Linear", icon: "L", color: "bg-indigo-500" },
            { name: "Jira", icon: "J", color: "bg-blue-600" },
          ].map((integration) => (
            <button
              key={integration.name}
              className="flex items-center justify-between p-4 border border-sand-200 rounded-lg hover:border-sky-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${integration.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {integration.icon}
                </div>
                <span className="font-medium text-sand-900">{integration.name}</span>
              </div>
              <span className="text-sm text-sky-blue-600 font-medium">Connect</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="flex items-center gap-1 text-mint-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Settings saved
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-sky-blue-600 text-white rounded-lg font-medium hover:bg-sky-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
