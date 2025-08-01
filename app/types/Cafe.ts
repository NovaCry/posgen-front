export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  tableId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  table: {
    id: string;
    name: string;
    seatSize: number;
  };
}

export interface TimelineReservation {
  name: string;
  start: Date;
  end: Date;
  tableNumber: number;
  tableName: string;
  status: string;
}

export interface TimelineGroup {
  name: string;
  reservations: TimelineReservation[];
}
