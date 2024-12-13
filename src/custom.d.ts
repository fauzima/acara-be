import "express";

export type AccPayload = {
  id: string;
  role: "user" | "promotor"
};

export type EventPayload = {
  id: string;
};

declare global {
  namespace Express {
    export interface Request {
      acc?: AccPayload;
      event?: EventPayload;
    }
  }
}
