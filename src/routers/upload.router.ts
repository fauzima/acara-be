import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { uploader } from "../services/uploader";

export class UploadRouter {
  private router: Router;
  private uploadController: UploadController;

  constructor() {
    this.uploadController = new UploadController();
    this.router = Router();
    this.initializeRoutes;
  }

  private initializeRoutes() {
    // route for uploading an image
    this.router.patch(
      "/single",
      uploader("diskStorage", "IMG", "/images").single("file"),
      this.uploadController.addNewImage
    );

    // route for uploading multiple images
    this.router.post(
      "/multiple",
      uploader("diskStorage", "IMG", "/images").array("files", 3),
      this.uploadController.addMultipleNewImages
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
