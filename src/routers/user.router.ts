import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // route for getting all users and their data
    this.router.get("/", this.userController.getUsers);
    // route for adding a new user
    this.router.post("/", this.userController.postUser);

    // route for getting a user's data by its id
    this.router.get("/:id", this.userController.getUserbyId);
    // route for editing a user's data by its id
    this.router.patch("/:id", this.userController.patchUser);
    //route for deleting a user by its id
    this.router.delete("/:id", this.userController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
