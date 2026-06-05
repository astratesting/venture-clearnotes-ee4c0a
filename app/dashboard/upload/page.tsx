"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileAudio, Loader2, CheckCircle, X } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ["audio/mpeg", "audio/wav", "audio/wave", "audio/x-wav", "audio/mp4", "audio/webm"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please select a valid audio file (MP3, WAV, etc.)");
        return;
      }
      setFile(selectedFile);
      setError("");
      // Auto-fill title from filename
      if (!title) {
        const name = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(name.replace(/[_-]/g, " "));
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("meetingDate", meetingDate);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload file");
      }

      const data = await response.json();

      // Wait a moment to show completed state
      setTimeout(() => {
        router.push(`/dashboard/meetings/${data.id}`);
      }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to upload file");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-sand-900">Upload Recording</h1>
        <p className="text-sand-500 mt-2">
          Upload an audio or video file to transcribe and extract action items
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-sand-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-2">
              Recording File
            </label>
            {!file ? (
              <div className="relative">
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-sand-300 rounded-xl p-8 text-center hover:border-sky-blue-400 hover:bg-sky-blue-50 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sky-blue-50 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-sky-blue-600" />
                  </div>
                  <p className="text-sand-900 font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sand-500 text-sm mt-1">
                    MP3, WAV, MP4, WEBM up to 500MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-sand-200 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-sky-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileAudio className="w-6 h-6 text-sky-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sand-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-sand-500">{formatFileSize(file.size)}</p>
                  </div>
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 text-sand-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {isUploading && (
                  <div className="mt-4">
                    <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-sand-500 mt-2 text-center">
                      {uploadProgress === 100 ? (
                        <span className="flex items-center justify-center gap-1 text-mint-600">
                          <CheckCircle className="w-4 h-4" />
                          Upload complete! Redirecting...
                        </span>
                      ) : (
                        `Uploading... ${uploadProgress}%`
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Meeting Details */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-sand-700 mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
              placeholder="Weekly Team Standup"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-sand-700 mb-2">
              Description <span className="text-sand-400">(Optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500 resize-none"
              placeholder="Add any additional context about the meeting..."
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-sand-700 mb-2">
              Meeting Date & Time
            </label>
            <input
              type="datetime-local"
              id="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-sand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !file}
            className="w-full flex items-center justify-center gap-2 bg-sky-blue-600 text-white py-3 rounded-lg font-medium hover:bg-sky-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload and Process
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-mint-50 rounded-xl p-6 border border-mint-100">
        <h3 className="text-sm font-semibold text-mint-800 mb-2">Tips for best results</h3>
        <ul className="text-sm text-mint-700 space-y-1 list-disc list-inside">
          <li>Use high-quality audio files for better transcription accuracy</li>
          <li>Minimize background noise when recording</li>
          <li>Clearly state action items and assignees during the meeting</li>
          <li>Supported formats: MP3, WAV, M4A, MP4, WEBM</li>
        </ul>
      </div>
    </div>
  );
}
