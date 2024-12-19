import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { verifyToken } from "../middleware/verify";

export class DashboardRouter {
  private dashboardController: DashboardController;
  private router: Router;

  constructor() {
    this.dashboardController = new DashboardController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/event",verifyToken,this.dashboardController.getSummaries)
  }

  getRouter(): Router {
    return this.router;
  }
}
