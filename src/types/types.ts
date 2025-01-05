import { EventCategory, EventLocation } from "prisma/generated/client";

export interface ITicketReq {
  ticketCategory: string;
  ticketDesc: string;
  seats: string;
  price: string;
  startDate: string;
  endDate: string;
}

export interface IEvent {
  title: string;
  desc: string;
  category: EventCategory;
  location: EventLocation;
  venue: string;
  startDate: string;
  endDate: string;
  Ticket: string;
}

export interface ITicket {
  category: string;
  desc: string;
  seats: number;
  remainingSeats: number;
  price: number;
  startDate: Date;
  endDate: Date;
}

export interface IOrderDetailsReq{ 
  qty: string
  ticketId: string
}

export interface IOrderDetails{
  qty: number
  ticketId: string
}

export interface IOrder {
  totalPrice: string
  finalPrice: string
  OrderDetails: IOrderDetailsReq[]
  UserPoint?: string[]
  UserCoupon?: string
}
