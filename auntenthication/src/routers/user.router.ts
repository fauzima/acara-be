import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyTokenProm } from "../middleware/verify";

export class UserRouter {
  private userController: UserController;
  private router: Router;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", verifyTokenProm, this.userController.getUsers);
    this.router.get("/profile", verifyTokenProm, this.userController.getUserId);
    this.router.post("/", this.userController.createUser);

    this.router.patch("/:id", this.userController.editUser);
    this.router.delete("/:id", this.userController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
