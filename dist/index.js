"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = require("./routers/user.router");
const auth_router_1 = require("./routers/auth.router");
const promotor_router_1 = require("./routers/promotor.router");
const dashboard_router_1 = require("./routers/dashboard.router");
const event_router_1 = require("./routers/event.router");
const multer_1 = __importDefault(require("multer"));
const node_cron_1 = __importDefault(require("node-cron"));
const scheduler_1 = require("./services/scheduler");
const order_router_1 = require("./routers/order.router");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
exports.upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
app.use((0, cors_1.default)({
    methods: "GET,POST,PATCH,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    origin: `${process.env.BASE_URL_FE}`,
    credentials: true,
}));
app.get("/api", (req, res) => {
    res.status(200).send("welcome to my API");
});
node_cron_1.default.schedule("*/30 * * * * *", scheduler_1.ScheduledTasks);
const userRouter = new user_router_1.UserRouter();
const authRouter = new auth_router_1.AuthRouter();
const promRouter = new promotor_router_1.PromotorRouter();
const dashRouter = new dashboard_router_1.DashboardRouter();
const eventRouter = new event_router_1.EventRouter();
const orderRouter = new order_router_1.OrderRouter();
app.use("/api/users", userRouter.getRouter());
app.use("/api/promotors", promRouter.getRouter());
app.use("/api/auth", authRouter.getRouter());
app.use("/api/dashboard", dashRouter.getRouter());
app.use("/api/events", eventRouter.getRouter());
app.use("/api/orders", orderRouter.getRouter());
app.listen(PORT, () => {
    console.log(`server running on -> http://localhost:${PORT}/api`);
});
exports.default = app;
