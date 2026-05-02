"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Field, Input, Select } from "@/components/ui";

export function AdminForms({
  hotels,
}: {
  hotels: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [hotelName, setHotelName] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(hotels[0]?.id ?? "");
  const [roomType, setRoomType] = useState("");
  const [priceEtb, setPriceEtb] = useState("");
  const [totalRooms, setTotalRooms] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function createHotel(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: hotelName }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create hotel");
      return;
    }

    setHotelName("");
    setMessage("Hotel created.");
    router.refresh();
  }

  async function addRoomType(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!selectedHotel) {
      setError("Create a hotel first.");
      return;
    }

    const res = await fetch(`/api/hotels/${selectedHotel}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: roomType,
        priceEtb: Number(priceEtb),
        totalRooms: Number(totalRooms),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to add room type");
      return;
    }

    setRoomType("");
    setPriceEtb("");
    setTotalRooms("");
    setMessage("Room type added.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-4 text-lg font-semibold">Create hotel</h2>
        <form onSubmit={createHotel} className="space-y-4">
          <Field label="Hotel name">
            <Input
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              required
              placeholder="e.g. Blue Nile Hotel"
            />
          </Field>
          <Button type="submit">Create hotel</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Add room type</h2>
        <form onSubmit={addRoomType} className="space-y-4">
          <Field label="Hotel">
            <Select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              required
            >
              <option value="" disabled>
                Select hotel
              </option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Room type">
            <Input
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              required
              placeholder="e.g. 1 Bedroom Standard"
            />
          </Field>
          <Field label="List price (ETB)">
            <Input
              value={priceEtb}
              onChange={(e) => setPriceEtb(e.target.value)}
              required
              type="number"
              min={1}
            />
          </Field>
          <Field label="Total identical rooms">
            <Input
              value={totalRooms}
              onChange={(e) => setTotalRooms(e.target.value)}
              required
              type="number"
              min={1}
            />
          </Field>
          <Button type="submit" disabled={hotels.length === 0}>
            Add room type
          </Button>
        </form>
      </Card>

      {message ? <p className="text-sm text-teal-800">{message}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
