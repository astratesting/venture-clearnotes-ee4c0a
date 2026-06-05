import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Verify the action item belongs to the user via meeting
    const existingItem = await db.actionItem.findFirst({
      where: {
        id: params.id,
        meeting: { userId: session.user.id },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Action item not found" },
        { status: 404 }
      );
    }

    const actionItem = await db.actionItem.update({
      where: { id: params.id },
      data: body,
      include: {
        meeting: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json(actionItem);
  } catch (error) {
    console.error("Error updating action item:", error);
    return NextResponse.json(
      { error: "Failed to update action item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the action item belongs to the user via meeting
    const existingItem = await db.actionItem.findFirst({
      where: {
        id: params.id,
        meeting: { userId: session.user.id },
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Action item not found" },
        { status: 404 }
      );
    }

    await db.actionItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting action item:", error);
    return NextResponse.json(
      { error: "Failed to delete action item" },
      { status: 500 }
    );
  }
}
