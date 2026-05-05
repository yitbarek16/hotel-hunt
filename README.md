# Hotel Hunt

A bidding-based hotel room booking platform. Hotels list room types with inventory counts; guests place price offers; hotels accept, reject, or confirm bookings.

## Monorepo structure

```
hotel-hunt/
├── apps/web          # Next.js app (UI + API routes)
├── packages/database # Prisma schema + SQLite client
├── turbo.json
└── package.json
```

## Features

- **Admin** — Create hotels and room types (bulk inventory, no per-room entry)
- **Room listings** — Type, ETB price, total/booked/remaining rooms
- **User bidding** — Name, phone, offered price; status starts as `PENDING`
- **Hotel decisions** — Accept (increments booked count), reject, or mark `BOOKED`
- **Availability** — Remaining rooms computed as `totalRooms - bookedRooms`
- **Contact flow** — Phone shown to hotels after bid acceptance

## Quick start

```bash
# Install dependencies
npm install

# Generate Prisma client and create database
npm run db:generate
npm run db:push

# Optional: seed sample hotel, rooms, and bids
npm run db:seed

# Start dev server
npm run dev
```

If Prisma fails to download binaries with an SSL/certificate error (common on some corporate networks), run from `packages/database`:

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx prisma generate
npx prisma db push
```

Open [http://localhost:3000](http://localhost:3000).

| Page | URL |
|------|-----|
| Browse & bid | `/` |
| Admin | `/admin` |
| Hotel dashboard | `/hotels/[hotelId]` |

## API routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/hotels` | List hotels with rooms |
| `POST` | `/api/hotels` | Create hotel |
| `POST` | `/api/hotels/[hotelId]/rooms` | Add room type |
| `GET` | `/api/rooms` | List all room types |
| `GET` | `/api/bids?roomTypeId=&hotelId=` | List bids |
| `POST` | `/api/bids` | Place bid |
| `PATCH` | `/api/bids/[bidId]` | `{ "action": "ACCEPT" \| "REJECT" \| "BOOKED" }` |

## Tech stack

- [Turborepo](https://turbo.build/)
- [Next.js 15](https://nextjs.org/) (App Router)
- [Prisma](https://www.prisma.io/) + SQLite
- Tailwind CSS 4

## Environment

`apps/web/.env.local` points to the SQLite file in `packages/database/prisma/dev.db`.

For production, switch the Prisma datasource to PostgreSQL and set `DATABASE_URL` accordingly.
