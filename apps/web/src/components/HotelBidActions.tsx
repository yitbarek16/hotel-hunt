"use client";

import { BidStatus } from "@hotel-hunt/database";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Button } from "./ui";

type Bid = {
  id: string;
  name: string;
  phone: string;
  offeredPrice: number;
  status: BidStatus;
  roomType: { type: string };
};

export function HotelBidActions({ bid }: { bid: Bid }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateBid(action: "ACCEPT" | "REJECT" | "BOOKED") {
    setLoading(action);
    setError("");

    const res = await fetch(`/api/bids/${bid.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    setLoading(null);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Action failed");
      return;
    }

    router.refresh();
  }

  const showContact = bid.status === "ACCEPTED" || bid.status === "BOOKED";

  return (
    <div className="flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-stone-900">{bid.name}</p>
          <Badge status={bid.status} />
        </div>
        <p className="text-sm text-stone-600">
          {bid.roomType.type} · ETB {bid.offeredPrice.toLocaleString()}
        </p>
        {showContact ? (
          <p className="mt-1 text-sm font-medium text-teal-800">
            Contact: {bid.phone}
          </p>
        ) : null}
        {error ? <p className="mt-1 text-sm text-rose-700">{error}</p> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {bid.status === "PENDING" ? (
          <>
            <Button
              variant="primary"
              disabled={loading !== null}
              onClick={() => updateBid("ACCEPT")}
            >
              {loading === "ACCEPT" ? "..." : "Accept"}
            </Button>
            <Button
              variant="danger"
              disabled={loading !== null}
              onClick={() => updateBid("REJECT")}
            >
              {loading === "REJECT" ? "..." : "Reject"}
            </Button>
          </>
        ) : null}
        {bid.status === "ACCEPTED" ? (
          <Button
            variant="secondary"
            disabled={loading !== null}
            onClick={() => updateBid("BOOKED")}
          >
            {loading === "BOOKED" ? "..." : "Mark booked"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
