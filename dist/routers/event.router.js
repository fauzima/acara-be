"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRouter = void 0;
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const verify_1 = require("../middleware/verify");
const index_1 = require("../index");
class EventRouter {
    constructor() {
        this.eventController = new event_controller_1.EventController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", this.eventController.getEvents);
        this.router.post("/create", verify_1.verifyToken, index_1.upload.single("thumbnail"), this.eventController.createEvent);
        this.router.get("/:id", this.eventController.getEventId);
    }
    getRouter() {
        return this.router;
    }
}
exports.EventRouter = EventRouter;
