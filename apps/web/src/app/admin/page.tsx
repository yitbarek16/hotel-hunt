import { prisma } from "@hotel-hunt/database";
import { AdminForms } from "./AdminForms";
import { Card, PageShell } from "@/components/ui";
import { roomWithAvailability } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const hotels = await prisma.hotel.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      roomTypes: { orderBy: { type: "asc" } },
    },
  });

  return (
    <PageShell
      title="Hotel administration"
      subtitle="Create hotels and add room types in bulk — identical rooms share one listing with a total count."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <AdminForms hotels={hotels.map((h) => ({ id: h.id, name: h.name }))} />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">All hotels</h2>
          {hotels.length === 0 ? (
            <Card>
              <p className="text-stone-600">No hotels yet.</p>
            </Card>
          ) : (
            hotels.map((hotel) => (
              <Card key={hotel.id}>
                <h3 className="font-semibold text-stone-900">{hotel.name}</h3>
                <p className="mt-1 text-xs text-stone-500">ID: {hotel.id}</p>
                {hotel.roomTypes.length === 0 ? (
                  <p className="mt-3 text-sm text-stone-600">No room types yet.</p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {hotel.roomTypes.map((room) => {
                      const r = roomWithAvailability(room);
                      return (
                        <li
                          key={room.id}
                          className="rounded-lg bg-stone-50 px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{r.type}</span> — ETB{" "}
                          {r.priceEtb.toLocaleString()} · {r.remainingRooms}/
                          {r.totalRooms} left
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
