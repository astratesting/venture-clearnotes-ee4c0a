import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const statusParam = searchParams.get("status") as "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId: session.user.id,
    };
    if (statusParam) where.status = statusParam;

    const [meetings, total] = await Promise.all([
      db.meeting.findMany({
        where,
        include: {
          _count: {
            select: { actionItems: true },
          },
        },
        orderBy: { meetingDate: "desc" },
        take: limit,
        skip: offset,
      }),
      db.meeting.count({ where }),
    ]);

    return NextResponse.json({ meetings, total });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, meetingDate, audioUrl } = body;

    if (!title || !meetingDate) {
      return NextResponse.json(
        { error: "Title and meeting date are required" },
        { status: 400 }
      );
    }

    const meeting = await db.meeting.create({
      data: {
        title,
        description,
        meetingDate: new Date(meetingDate),
        audioUrl,
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        _count: {
          select: { actionItems: true },
        },
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
