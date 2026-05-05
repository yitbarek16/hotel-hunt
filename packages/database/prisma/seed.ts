import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.hotel.upsert({
    where: { id: "seed-hotel-1" },
    update: {},
    create: {
      id: "seed-hotel-1",
      name: "Addis Grand Hotel",
      roomTypes: {
        create: [
          {
            type: "Standard 1 Bedroom",
            priceEtb: 2500,
            totalRooms: 20,
            bookedRooms: 3,
          },
          {
            type: "Deluxe Suite",
            priceEtb: 5500,
            totalRooms: 8,
            bookedRooms: 1,
          },
        ],
      },
    },
    include: { roomTypes: true },
  });

  const standardRoom = hotel.roomTypes.find((r) => r.type.includes("Standard"));
  if (standardRoom) {
    await prisma.bid.createMany({
      data: [
        {
          roomTypeId: standardRoom.id,
          name: "Abebe Kebede",
          phone: "+251911000001",
          offeredPrice: 2200,
          status: "PENDING",
        },
        {
          roomTypeId: standardRoom.id,
          name: "Sara Tadesse",
          phone: "+251922000002",
          offeredPrice: 2400,
          status: "PENDING",
        },
      ],
    });
  }

  console.log("Seed complete:", hotel.name);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
