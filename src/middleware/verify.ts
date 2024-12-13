import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AccPayload } from "../custom";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const token = req.header("Authorization")?.replace("Bearer ", "");
    const token = req.cookies?.token
    if (!token) throw {message:"Tidak ada izin untuk mengakses"};

    const verifiedUser = verify(token, process.env.JWT_KEY!);
    req.acc = verifiedUser as AccPayload;

    next();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

// export const verifyTokenProm = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.cookies?.token
//     if (!token) throw {message:"Tidak ada izin untuk mengakses"};


//     const verifiedProm = verify(token, process.env.JWT_KEY!);
//     req.user = verifiedProm as PromPayload;

//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// };

// export const checkAdmin = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//     if(req.user?.role == "Admin"){
//         next()
//     } else{
//         res.status(400).send("Unathorize, Admin only")
//     }
// };