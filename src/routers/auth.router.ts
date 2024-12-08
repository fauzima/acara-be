import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // route for user registration
    this.router.post("/register", this.authController.registerUser);

    // route for user login
    this.router.post("/login", this.authController.logUser);

    // route for user verification
    this.router.patch("/verify/:token", this.authController.verifyUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
