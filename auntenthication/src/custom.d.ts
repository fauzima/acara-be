import "express";

export type UserPayload = {
  id: number;
};

export type PromPayload = {
  id: number;
};

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
      promotor?: PromPayload;
    }
  }
}
