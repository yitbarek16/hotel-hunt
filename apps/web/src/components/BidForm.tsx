"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, Input } from "./ui";

export function BidForm({
  roomTypeId,
  listPrice,
}: {
  roomTypeId: string;
  listPrice: number;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [offeredPrice, setOfferedPrice] = useState(String(listPrice));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/bids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomTypeId,
        name,
        phone,
        offeredPrice: Number(offeredPrice),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to place bid");
      return;
    }

    router.refresh();
    setName("");
    setPhone("");
    setOfferedPrice(String(listPrice));
    alert("Bid submitted! The hotel will review your offer.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Your name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Full name"
        />
      </Field>
      <Field label="Phone number">
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="+2519..."
          type="tel"
        />
      </Field>
      <Field label="Your offer (ETB)">
        <Input
          value={offeredPrice}
          onChange={(e) => setOfferedPrice(e.target.value)}
          required
          type="number"
          min={1}
        />
      </Field>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Place bid"}
      </Button>
    </form>
  );
}
