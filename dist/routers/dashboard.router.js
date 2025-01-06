"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRouter = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const verify_1 = require("../middleware/verify");
class DashboardRouter {
    constructor() {
        this.dashboardController = new dashboard_controller_1.DashboardController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/summary", verify_1.verifyToken, this.dashboardController.getSummaries);
        this.router.get("/eventaktif", verify_1.verifyToken, this.dashboardController.getEventAktif);
        this.router.get("/ticket", verify_1.verifyToken, this.dashboardController.getTicket);
        this.router.get("/transaction", verify_1.verifyToken, this.dashboardController.getTransaction);
    }
    getRouter() {
        return this.router;
    }
}
exports.DashboardRouter = DashboardRouter;
