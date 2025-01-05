import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { verifyToken } from "../middleware/verify";
import { upload } from "../index";

export class EventRouter {
  private eventController: EventController;
  private router: Router;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.eventController.getEvents);
    this.router.post(
      "/create",
      verifyToken,
      upload.single("thumbnail"),
      this.eventController.createEvent
    );

    this.router.get("/:id", this.eventController.getEventId);
  }

  getRouter(): Router {
    return this.router;
  }
}
