export function remainingRooms(totalRooms: number, bookedRooms: number) {
  return Math.max(0, totalRooms - bookedRooms);
}

export function roomWithAvailability<
  T extends { totalRooms: number; bookedRooms: number },
>(room: T) {
  return {
    ...room,
    remainingRooms: remainingRooms(room.totalRooms, room.bookedRooms),
  };
}
