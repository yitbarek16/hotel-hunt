import { prisma } from "@hotel-hunt/database";
import Link from "next/link";
import { BidForm } from "@/components/BidForm";
import { Card, PageShell, Stat } from "@/components/ui";
import { roomWithAvailability } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rooms = await prisma.roomType.findMany({
    orderBy: { priceEtb: "asc" },
    include: { hotel: true },
  });

  const enriched = rooms.map(roomWithAvailability);

  return (
    <PageShell
      title="Find a room, name your price"
      subtitle="Browse available room types across hotels and place a bid. Hotels review offers and accept the ones that work for them."
    >
      {enriched.length === 0 ? (
        <Card>
          <p className="text-stone-600">
            No rooms listed yet.{" "}
            <Link href="/admin" className="font-medium text-teal-800 underline">
              Add a hotel and room types
            </Link>{" "}
            to get started.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {enriched.map((room) => (
            <Card key={room.id}>
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-teal-800">
                      {room.hotel.name}
                    </p>
                    <h2 className="text-xl font-semibold text-stone-900">
                      {room.type}
                    </h2>
                    <p className="mt-1 text-stone-600">
                      List price:{" "}
                      <span className="font-semibold text-stone-900">
                        ETB {room.priceEtb.toLocaleString()}
                      </span>
                      / night
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Stat label="Total" value={room.totalRooms} />
                    <Stat label="Booked" value={room.bookedRooms} />
                    <Stat
                      label="Remaining"
                      value={room.remainingRooms}
                      hint={
                        room.remainingRooms > 0
                          ? "Available to bid"
                          : "Fully booked"
                      }
                    />
                  </div>
                  <Link
                    href={`/hotels/${room.hotelId}`}
                    className="text-sm font-medium text-teal-800 hover:underline"
                  >
                    View hotel dashboard →
                  </Link>
                </div>
                <div className="w-full max-w-sm rounded-xl border border-stone-100 bg-stone-50 p-4">
                  <h3 className="mb-3 font-medium text-stone-900">Place a bid</h3>
                  {room.remainingRooms > 0 ? (
                    <BidForm roomTypeId={room.id} listPrice={room.priceEtb} />
                  ) : (
                    <p className="text-sm text-stone-600">
                      This room type is fully booked. Check back later.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
