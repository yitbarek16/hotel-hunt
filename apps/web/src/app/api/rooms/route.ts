import { prisma } from "@hotel-hunt/database";
import { NextResponse } from "next/server";
import { roomWithAvailability } from "@/lib/rooms";

export async function GET() {
  const rooms = await prisma.roomType.findMany({
    orderBy: { priceEtb: "asc" },
    include: { hotel: true },
  });

  return NextResponse.json(rooms.map(roomWithAvailability));
}
