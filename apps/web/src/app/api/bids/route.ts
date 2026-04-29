import { prisma } from "@hotel-hunt/database";
import { NextResponse } from "next/server";
import { remainingRooms } from "@/lib/rooms";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomTypeId = searchParams.get("roomTypeId");
  const hotelId = searchParams.get("hotelId");

  const bids = await prisma.bid.findMany({
    where: {
      ...(roomTypeId ? { roomTypeId } : {}),
      ...(hotelId ? { roomType: { hotelId } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      roomType: { include: { hotel: true } },
    },
  });

  return NextResponse.json(bids);
}

export async function POST(request: Request) {
  const body = await request.json();
  const roomTypeId =
    typeof body.roomTypeId === "string" ? body.roomTypeId.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const offeredPrice = Number(body.offeredPrice);

  if (!roomTypeId || !name || !phone) {
    return NextResponse.json(
      { error: "Room, name, and phone are required" },
      { status: 400 },
    );
  }

  if (!Number.isFinite(offeredPrice) || offeredPrice <= 0) {
    return NextResponse.json(
      { error: "Offered price must be a positive number" },
      { status: 400 },
    );
  }

  const roomType = await prisma.roomType.findUnique({
    where: { id: roomTypeId },
  });

  if (!roomType) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (remainingRooms(roomType.totalRooms, roomType.bookedRooms) <= 0) {
    return NextResponse.json({ error: "No rooms available" }, { status: 409 });
  }

  const bid = await prisma.bid.create({
    data: {
      roomTypeId,
      name,
      phone,
      offeredPrice: Math.round(offeredPrice),
      status: "PENDING",
    },
    include: { roomType: { include: { hotel: true } } },
  });

  return NextResponse.json(bid, { status: 201 });
}
