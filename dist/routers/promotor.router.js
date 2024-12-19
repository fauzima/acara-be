"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotorRouter = void 0;
const express_1 = require("express");
const verify_1 = require("../middleware/verify");
const promotor_controller_1 = require("../controllers/promotor.controller");
class PromotorRouter {
    constructor() {
        this.promotorController = new promotor_controller_1.PromotorController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/", verify_1.verifyToken, this.promotorController.getPromotors);
        this.router.get("/profile", verify_1.verifyToken, this.promotorController.getPromotorId);
        this.router.post("/", this.promotorController.createPromotor);
        this.router.patch("/:id", this.promotorController.editPromotor);
        this.router.delete("/:id", this.promotorController.deletePromotor);
    }
    getRouter() {
        return this.router;
    }
}
exports.PromotorRouter = PromotorRouter;
