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
    this.router.get(
      "/summary",
      verifyToken,
      this.dashboardController.getSummaries
    );
    this.router.get(
      "/eventaktif",
      verifyToken,
      this.dashboardController.getEventAktif
    );
    this.router.get("/ticket", verifyToken, this.dashboardController.getTicket);
    this.router.get(
      "/transaction",
      verifyToken,
      this.dashboardController.getTransaction
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
