"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = require("./routers/user.router");
const auth_router_1 = require("./routers/auth.router");
const promotor_router_1 = require("./routers/promotor.router");
const dashboard_router_1 = require("./routers/dashboard.router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv").config();
const PORT = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: `${process.env.BASE_URL_FE}`,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.get("/api", (req, res) => {
    res.status(200).send("welcome to my API");
});
const userRouter = new user_router_1.UserRouter();
const authRouter = new auth_router_1.AuthRouter();
const promRouter = new promotor_router_1.PromotorRouter();
const dashRouter = new dashboard_router_1.DashboardRouter();
app.use("/api/users", userRouter.getRouter());
app.use("/api/promotors", promRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());
app.use("/api/dashboard", dashRouter.getRouter());
app.listen(PORT, () => {
    console.log(`server running on -> http://localhost:${PORT}/api`);
});
