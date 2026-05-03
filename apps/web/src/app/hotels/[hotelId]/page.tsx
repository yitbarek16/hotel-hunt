import { prisma } from "@hotel-hunt/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HotelBidActions } from "@/components/HotelBidActions";
import { Card, PageShell, Stat } from "@/components/ui";
import { roomWithAvailability } from "@/lib/rooms";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ hotelId: string }> };

export default async function HotelDashboardPage({ params }: Props) {
  const { hotelId } = await params;

  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      roomTypes: { orderBy: { type: "asc" } },
    },
  });

  if (!hotel) notFound();

  const bids = await prisma.bid.findMany({
    where: { roomType: { hotelId } },
    orderBy: { createdAt: "desc" },
    include: { roomType: true },
  });

  const rooms = hotel.roomTypes.map(roomWithAvailability);
  const totalCapacity = rooms.reduce((sum, r) => sum + r.totalRooms, 0);
  const totalBooked = rooms.reduce((sum, r) => sum + r.bookedRooms, 0);

  return (
    <PageShell
      title={hotel.name}
      subtitle="Review bids, accept or reject offers, and confirm bookings. Contact details appear after acceptance."
    >
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Room types" value={rooms.length} />
        <Stat label="Booked rooms" value={totalBooked} />
        <Stat
          label="Available"
          value={totalCapacity - totalBooked}
          hint={`of ${totalCapacity} total`}
        />
      </div>

      <div className="mb-10 grid gap-4">
        <h2 className="text-lg font-semibold text-stone-900">Room inventory</h2>
        {rooms.map((room) => (
          <Card key={room.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-stone-900">{room.type}</h3>
                <p className="text-sm text-stone-600">
                  ETB {room.priceEtb.toLocaleString()} · {room.bookedRooms} booked ·{" "}
                  {room.remainingRooms} remaining
                </p>
              </div>
              <div className="h-2 w-40 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{
                    width: `${(room.bookedRooms / room.totalRooms) * 100}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">All bids</h2>
        {bids.length === 0 ? (
          <Card>
            <p className="text-stone-600">No bids yet for this hotel.</p>
          </Card>
        ) : (
          bids.map((bid) => (
            <Card key={bid.id}>
              <HotelBidActions bid={bid} />
            </Card>
          ))
        )}
      </div>

      <p className="mt-8 text-sm text-stone-500">
        <Link href="/" className="text-teal-800 hover:underline">
          ← Back to room listings
        </Link>
      </p>
    </PageShell>
  );
}
