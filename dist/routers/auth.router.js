"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const verify_1 = require("../middleware/verify");
class AuthRouter {
    constructor() {
        this.authController = new auth_controller_1.AuthController();
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/session", verify_1.verifyToken, this.authController.getSession);
        this.router.post("/user", this.authController.registerUser);
        this.router.post("/user/login", this.authController.loginUser);
        this.router.patch("/user/verify/:token", this.authController.verifyUser);
        this.router.post("/promotor", this.authController.registerPromotor);
        this.router.post("/promotor/login", this.authController.loginPromotor);
        this.router.patch("/promotor/verify/:token", this.authController.verifyProm);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRouter = AuthRouter;
