"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Card } from "ui-components";
import { formatPrice } from "utils";

type Room = {
  id: number;
  roomType: string;
  price: number;
  totalRooms: number;
  bookedRooms: number;
};

type Hotel = {
  id: number;
  name: string;
  phone?: string;
  location?: string;
  rooms: Room[];
};

export default function AdminPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Hotel Form State
  const [hotelName, setHotelName] = useState("");
  const [hotelPhone, setHotelPhone] = useState("");
  const [hotelSubmitting, setHotelSubmitting] = useState(false);

  // Add Room Form State
  const [roomType, setRoomType] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [totalRooms, setTotalRooms] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [roomSubmitting, setRoomSubmitting] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hotel");
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
      } else {
        throw new Error("Failed to load hotels list");
      }
    } catch (err: any) {
      console.error("Failed to fetch hotels:", err);
      setError("Unable to connect to the database. Running in UI design/offline mode.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelName.trim()) return;
    
    setHotelSubmitting(true);
    try {
      const res = await fetch("/api/hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: hotelName,
          phone: hotelPhone || undefined,
          location: "TBD", // Dummy location to satisfy database constraint if needed
        }),
      });
      if (res.ok) {
        setHotelName("");
        setHotelPhone("");
        fetchHotels();
      } else {
        throw new Error("Could not add hotel");
      }
    } catch (err) {
      console.error("Error adding hotel:", err);
      alert("Failed to add hotel (Make sure the API backend is running).");
    } finally {
      setHotelSubmitting(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomType.trim() || !roomPrice || !totalRooms || !selectedHotelId) return;

    setRoomSubmitting(true);
    try {
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomType,
          price: parseFloat(roomPrice),
          totalRooms: parseInt(totalRooms, 10),
          hotelId: parseInt(selectedHotelId, 10),
        }),
      });
      if (res.ok) {
        setRoomType("");
        setRoomPrice("");
        setTotalRooms("");
        setSelectedHotelId("");
        fetchHotels();
      } else {
        throw new Error("Could not add room");
      }
    } catch (err) {
      console.error("Error adding room:", err);
      alert("Failed to add room (Make sure the API backend is running).");
    } finally {
      setRoomSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent sm:text-5xl">
            Hotel Hunt Admin System
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-500 dark:text-slate-400">
            Create, manage, and inspect all hotels and their respective rooms.
          </p>
        </div>

        {/* Info Banner when offline/no API connection */}
        {error && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start space-x-3 text-amber-800 dark:text-amber-300 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-semibold block">Offline Mode Simulation Notice</span>
              {error} If you need backend integration, ensure your server is running and Prisma DB is configured properly.
            </div>
          </div>
        )}

        {/* Two Column Layout for Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Add Hotel Form */}
          <Card className="bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700/60 rounded-2xl overflow-hidden transition hover:shadow-2xl duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Add Hotel Form
              </h2>
            </div>
            
            <form onSubmit={handleAddHotel} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Hotel Name</label>
                <Input
                  type="text"
                  required
                  placeholder="Enter hotel name"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone <span className="text-slate-400 font-normal">(Optional)</span></label>
                <Input
                  type="text"
                  placeholder="e.g. +251..."
                  value={hotelPhone}
                  onChange={(e) => setHotelPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>

              <Button
                type="submit"
                disabled={hotelSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {hotelSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Hotel
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Section 2: Add Room Form */}
          <Card className="bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700/60 rounded-2xl overflow-hidden transition hover:shadow-2xl duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Add Room Form
              </h2>
            </div>
            
            <form onSubmit={handleAddRoom} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Hotel</label>
                <select
                  required
                  value={selectedHotelId}
                  onChange={(e) => setSelectedHotelId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                >
                  <option value="" disabled>Choose a hotel...</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Room Type</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. 1 bedroom, Deluxe Suite"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Price (ETB)</label>
                  <Input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="ETB Price"
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Total Rooms</label>
                  <Input
                    type="number"
                    required
                    min="1"
                    placeholder="Quantity"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={roomSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {roomSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Room
                  </>
                )}
              </Button>
            </form>
          </Card>

        </div>

        {/* Section 3: List of Hotels and Rooms */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            List of Hotels and Rooms
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400">Loading directory listings...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-4">
              <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Hotels Found</p>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                  Get started by adding your first hotel with the form above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <Card
                  key={hotel.id}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    {/* Hotel details */}
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        {hotel.name}
                      </h3>
                      {hotel.phone && (
                        <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-xs">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{hotel.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Rooms listing */}
                    <div className="border-t border-slate-100 dark:border-slate-700/60 pt-4 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                        Rooms
                      </span>
                      
                      {hotel.rooms && hotel.rooms.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/40">
                          {hotel.rooms.map((room) => (
                            <div key={room.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{room.roomType}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                  {room.totalRooms} room{room.totalRooms > 1 ? "s" : ""} capacity
                                </p>
                              </div>
                              <span className="font-bold text-violet-600 dark:text-violet-400 text-right">
                                {formatPrice(room.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-medium italic text-slate-400 dark:text-slate-500">
                          No rooms cataloged yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 px-6 py-3.5 border-t border-slate-100 dark:border-slate-700/40 flex justify-between items-center text-xs">
                    <span className="text-slate-400">ID: {hotel.id}</span>
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md font-semibold">
                      {hotel.rooms?.length || 0} Rooms Registered
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
