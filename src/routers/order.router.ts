import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { verifyToken } from "../middleware/verify";

export class OrderRouter {
  private orderController: OrderController;
  private router: Router;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post("/status", this.orderController.updateStatus);
    this.router.post("/:id", verifyToken, this.orderController.createOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
