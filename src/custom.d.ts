import "express";

export type AccPayload = {
  id: string;
  role: "user" | "promotor";
};

declare global {
  namespace Express {
    export interface Request {
      acc?: AccPayload;
    }
  }
}
