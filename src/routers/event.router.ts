import { Router } from "express";
import { EventController } from "../controllers/event.controller";

export class UserRouter {
  private eventController: EventController;
  private router: Router;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.eventController.getEvents);
    this.router.post("/", this.eventController.createEvent);

    this.router.get("/:id", this.eventController.getEventId);
    this.router.patch("/:id", this.eventController.editEvent);
    this.router.delete("/:id", this.eventController.deleteEvent);
  }

  getRouter(): Router {
    return this.router;
  }
}
