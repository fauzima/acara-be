import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRouter } from "./routers/user.router";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./routers/auth.router";
import path from "path";
import { UploadRouter } from "./routers/upload.router";

const PORT: number = 1337;

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: `http://localhost:${PORT}`,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("API is online.");
});

const userRouter = new UserRouter();
const authRouter = new AuthRouter();
const uploadRouter = new UploadRouter();

app.use("/api/public", express.static(path.join(__dirname, "../public")));

app.use("/api/user", userRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());
app.use("/api/upload", uploadRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on -> http://localhost:${PORT}/api`);
});
