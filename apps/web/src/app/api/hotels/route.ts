import { prisma } from "@hotel-hunt/database";
import { NextResponse } from "next/server";
import { roomWithAvailability } from "@/lib/rooms";

export async function GET() {
  const hotels = await prisma.hotel.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      roomTypes: {
        orderBy: { priceEtb: "asc" },
      },
    },
  });

  return NextResponse.json(
    hotels.map((hotel) => ({
      ...hotel,
      roomTypes: hotel.roomTypes.map(roomWithAvailability),
    })),
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Hotel name is required" }, { status: 400 });
  }

  const hotel = await prisma.hotel.create({
    data: { name },
  });

  return NextResponse.json(hotel, { status: 201 });
}
