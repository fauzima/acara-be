import { Router } from "express";
import { verifyToken } from "../middleware/verify";
import { PromotorController } from "../controllers/promotor.controller";

export class PromotorRouter {
  private promotorController: PromotorController;
  private router: Router;

  constructor() {
    this.promotorController = new PromotorController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", verifyToken, this.promotorController.getPromotors);
    this.router.get(
      "/profile",
      verifyToken,
      this.promotorController.getPromotorId
    );
    this.router.post("/", this.promotorController.createPromotor);

    this.router.patch("/:id", this.promotorController.editPromotor);
    this.router.delete("/:id", this.promotorController.deletePromotor);
  }

  getRouter(): Router {
    return this.router;
  }
}
