import { BidStatus, prisma } from "@hotel-hunt/database";
import { NextResponse } from "next/server";
import { remainingRooms } from "@/lib/rooms";

type Params = { params: Promise<{ bidId: string }> };

const VALID_ACTIONS = ["ACCEPT", "REJECT", "BOOKED"] as const;
type Action = (typeof VALID_ACTIONS)[number];

function actionToStatus(action: Action): BidStatus {
  if (action === "ACCEPT") return "ACCEPTED";
  if (action === "REJECT") return "REJECTED";
  return "BOOKED";
}

export async function PATCH(request: Request, { params }: Params) {
  const { bidId } = await params;
  const body = await request.json();
  const action = body.action as Action;

  if (!VALID_ACTIONS.includes(action)) {
    return NextResponse.json(
      { error: "Action must be ACCEPT, REJECT, or BOOKED" },
      { status: 400 },
    );
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { roomType: true },
  });

  if (!bid) {
    return NextResponse.json({ error: "Bid not found" }, { status: 404 });
  }

  const nextStatus = actionToStatus(action);

  if (action === "ACCEPT" && bid.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only pending bids can be accepted" },
      { status: 409 },
    );
  }

  if (action === "REJECT" && bid.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only pending bids can be rejected" },
      { status: 409 },
    );
  }

  if (action === "BOOKED" && bid.status !== "ACCEPTED") {
    return NextResponse.json(
      { error: "Only accepted bids can be marked as booked" },
      { status: 409 },
    );
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      if (action === "ACCEPT") {
        const room = await tx.roomType.findUnique({
          where: { id: bid.roomTypeId },
        });
        if (!room) throw new Error("ROOM_NOT_FOUND");

        if (remainingRooms(room.totalRooms, room.bookedRooms) <= 0) {
          throw new Error("NO_AVAILABILITY");
        }

        await tx.roomType.update({
          where: { id: room.id },
          data: { bookedRooms: { increment: 1 } },
        });
      }

      return tx.bid.update({
        where: { id: bidId },
        data: { status: nextStatus },
        include: { roomType: { include: { hotel: true } } },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "NO_AVAILABILITY") {
      return NextResponse.json({ error: "No rooms available" }, { status: 409 });
    }
    throw error;
  }
}
