import { Router } from "express";
import { verifyToken } from "../middleware/verify";
import { DashboardController } from "../controllers/dashboard.controller";

export class DashboardRouter {
  private dashboardController: DashboardController;
  private router: Router;

  constructor() {
    this.dashboardController = new DashboardController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/event",this.dashboardController.getActiveEvents)

  }

  getRouter(): Router {
    return this.router;
  }
}
