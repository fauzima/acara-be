import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verify";

export class AuthRouter {
  private authController: AuthController;
  private router: Router;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/session", verifyToken, this.authController.getSession);

    this.router.post("/user", this.authController.registerUser);
    this.router.post("/user/login", this.authController.loginUser);
    this.router.patch("/user/verify/:token", this.authController.verifyUser);

    this.router.post("/promotor", this.authController.registerPromotor);
    this.router.post("/promotor/login", this.authController.loginPromotor);
    this.router.patch(
      "/promotor/verify/:token",
      this.authController.verifyProm
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
