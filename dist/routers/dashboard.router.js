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
        this.router.get("/summary/", verify_1.verifyToken, this.dashboardController.getSummaries);
    }
    getRouter() {
        return this.router;
    }
}
exports.DashboardRouter = DashboardRouter;
