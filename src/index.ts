import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRouter } from "./routers/user.router";
import { AuthRouter } from "./routers/auth.router";
import { PromotorRouter } from "./routers/promotor.router";
import { DashboardRouter } from "./routers/dashboard.router";
import { EventRouter } from "./routers/event.router";
import multer from "multer";
import cron from "node-cron";
import { ScheduledTasks } from "./services/scheduler";
import { OrderRouter } from "./routers/order.router";
import dotenv from "dotenv";
dotenv.config();

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
export const upload = multer({ storage: multer.memoryStorage() });
app.use(
  cors({
    origin: `${process.env.BASE_URL_FE!}`,
    credentials: true,
  })
);

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("welcome to my API");
});

cron.schedule("*/30 * * * * *", ScheduledTasks);

const userRouter = new UserRouter();
const authRouter = new AuthRouter();
const promRouter = new PromotorRouter();
const dashRouter = new DashboardRouter();
const eventRouter = new EventRouter();
const orderRouter = new OrderRouter();

app.use("/api/users", userRouter.getRouter());
app.use("/api/promotors", promRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());
app.use("/api/dashboard", dashRouter.getRouter());
app.use("/api/events", eventRouter.getRouter());
app.use("/api/orders", orderRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on -> http://localhost:${PORT}/api`);
});

export default app