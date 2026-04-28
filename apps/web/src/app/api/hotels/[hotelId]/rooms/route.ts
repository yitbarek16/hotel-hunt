import { prisma } from "@hotel-hunt/database";
import { NextResponse } from "next/server";
import { roomWithAvailability } from "@/lib/rooms";

type Params = { params: Promise<{ hotelId: string }> };

export async function POST(request: Request, { params }: Params) {
  const { hotelId } = await params;
  const body = await request.json();

  const type = typeof body.type === "string" ? body.type.trim() : "";
  const priceEtb = Number(body.priceEtb);
  const totalRooms = Number(body.totalRooms);

  if (!type || !Number.isFinite(priceEtb) || priceEtb <= 0) {
    return NextResponse.json(
      { error: "Valid room type and price (ETB) are required" },
      { status: 400 },
    );
  }

  if (!Number.isInteger(totalRooms) || totalRooms <= 0) {
    return NextResponse.json(
      { error: "Total rooms must be a positive integer" },
      { status: 400 },
    );
  }

  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  }

  const roomType = await prisma.roomType.create({
    data: {
      hotelId,
      type,
      priceEtb: Math.round(priceEtb),
      totalRooms,
    },
  });

  return NextResponse.json(roomWithAvailability(roomType), { status: 201 });
}
