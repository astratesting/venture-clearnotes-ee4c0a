import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const meetingDate = formData.get("meetingDate") as string;

    if (!file || !title || !meetingDate) {
      return NextResponse.json(
        { error: "File, title, and meeting date are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/wave", "audio/x-wav", "audio/mp4", "audio/webm"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only audio files are allowed." },
        { status: 400 }
      );
    }

    // Upload file to storage (in production, this would upload to S3, etc.)
    // For now, we'll create the meeting with a placeholder URL
    const arrayBuffer = await file.arrayBuffer();
    const fileSize = file.size;

    // Estimate duration (rough approximation: 1MB ≈ 1 minute for MP3)
    const estimatedDurationMinutes = Math.ceil(fileSize / (1024 * 1024));

    // Create meeting in database
    const meeting = await db.meeting.create({
      data: {
        title,
        description,
        meetingDate: new Date(meetingDate),
        userId: session.user.id,
        status: "PENDING",
        duration: estimatedDurationMinutes,
        audioUrl: `/uploads/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      },
      include: {
        _count: {
          select: { actionItems: true },
        },
      },
    });

    // Trigger processing via backend service
    try {
      await fetch(`${process.env.BACKEND_URL}/api/process-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.API_KEY || "",
        },
        body: JSON.stringify({
          meetingId: meeting.id,
          userId: session.user.id,
          audioData: Buffer.from(arrayBuffer).toString("base64"),
          quality: "high",
          language: "en",
        }),
      });
    } catch (error) {
      console.error("Error triggering processing:", error);
      // Don't fail the request, processing will retry
    }

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
