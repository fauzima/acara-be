import "express";

export type UserPayload = {
  id: number;
};

export type PromotorPayload = {
  id: number;
};

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
      promotor?: PromotorPayload;
    }
  }
}