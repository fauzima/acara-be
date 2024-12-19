"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
class UserRouter {
    constructor() {
        this.eventController = new event_controller_1.EventController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.eventController.getEvents);
        this.router.post("/", this.eventController.createEvent);
        this.router.get("/:id", this.eventController.getEventId);
        this.router.patch("/:id", this.eventController.editEvent);
        this.router.delete("/:id", this.eventController.deleteEvent);
    }
    getRouter() {
        return this.router;
    }
}
exports.UserRouter = UserRouter;
