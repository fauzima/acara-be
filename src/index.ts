import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRouter } from "./routers/user.router";
import { AuthRouter } from "./routers/auth.router";
import { PromotorRouter } from "./routers/promotor.router";
import { DashboardRouter } from "./routers/dashboard.router";
import cookieParser from "cookie-parser";

require("dotenv").config();

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.BASE_URL_FE!}`,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("welcome to my API");
});

const userRouter = new UserRouter();
const authRouter = new AuthRouter();
const promRouter = new PromotorRouter();
const dashRouter = new DashboardRouter();

app.use("/api/users", userRouter.getRouter());
app.use("/api/promotors", promRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());
app.use("/api/dashboard", dashRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on -> http://localhost:${PORT}/api`);
});
