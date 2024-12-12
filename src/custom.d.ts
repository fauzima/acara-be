import "express";

export type UserPayload = {
  id: string;
};

export type PromPayload = {
  id: string;
};

export type EventPayload = {
  id: string
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
      promotor?: PromPayload;
      event?: EventPayload
    }
  }
}
