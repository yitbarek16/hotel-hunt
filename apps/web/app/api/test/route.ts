// apps/web/app/api/test/route.ts (Next.js 13+)
import { db } from "db";

export async function GET() {
  const hotels = await db.hotel.findMany();
  return Response.json(hotels);
}