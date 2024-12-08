import "express";

type UserPayload = {
  id: number;
};

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}
