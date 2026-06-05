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
    const statusParam = searchParams.get("status") as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | null;
    const priorityParam = searchParams.get("priority") as "LOW" | "MEDIUM" | "HIGH" | "URGENT" | null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      meeting: { userId: session.user.id },
    };
    if (statusParam) where.status = statusParam;
    if (priorityParam) where.priority = priorityParam;

    const [actionItems, total] = await Promise.all([
      db.actionItem.findMany({
        where,
        include: {
          meeting: {
            select: { title: true },
          },
        },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      db.actionItem.count({ where }),
    ]);

    return NextResponse.json({ actionItems, total });
  } catch (error) {
    console.error("Error fetching action items:", error);
    return NextResponse.json(
      { error: "Failed to fetch action items" },
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
    const { meetingId, content, assignee, deadline, priority } = body;

    if (!meetingId || !content) {
      return NextResponse.json(
        { error: "Meeting ID and content are required" },
        { status: 400 }
      );
    }

    // Verify the meeting belongs to the user
    const meeting = await db.meeting.findUnique({
      where: { id: meetingId, userId: session.user.id },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found" },
        { status: 404 }
      );
    }

    const actionItem = await db.actionItem.create({
      data: {
        meetingId,
        content,
        assignee,
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || "MEDIUM",
        status: "PENDING",
      },
      include: {
        meeting: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json(actionItem, { status: 201 });
  } catch (error) {
    console.error("Error creating action item:", error);
    return NextResponse.json(
      { error: "Failed to create action item" },
      { status: 500 }
    );
  }
}
